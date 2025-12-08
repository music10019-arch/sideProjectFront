"""
Flask 後端應用
用於提供選舉數據 API，讓前端 HTML 可以動態載入數據
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  # 加這一行

# 載入 CSV 數據
csv_file = 'House_2020_24.csv'

try:
    df = pd.read_csv(csv_file)
    print(f"✓ 成功載入 {len(df)} 筆選舉數據")
except FileNotFoundError:
    print(f"✗ 找不到文件: {csv_file}")
    df = pd.DataFrame()
# Create an empty DataFrame as a fallback
# so the program doesn't crash if the CSV file is not found

# @app.route('/api/states', methods=['GET'])
# def get_states():
#     """    獲取所有可用的州 """
#     states = df['state'].unique().tolist()   # 從 df 表格中取出 'state' 欄位
#     states.sort()     #Can be omitted
#     return jsonify({
#         'states': states,
#         # 'total': len(states)
#     })


@app.route('/api/years', methods=['GET'])
def get_years():
    """獲取所有可用的年份"""
    years = sorted(df['year'].unique().tolist())
    return jsonify({'years': years})


@app.route('/api/election-data', methods=['GET'])
def get_election_data():
    """
    根據州和年份獲取選舉數據

    查詢參數:
    - state: 州名 (例如: ALABAMA)
    - year: 年份 (例如: 2020)
    """
    state = request.args.get('state', '').upper()
    year = request.args.get('year', '')

    if not state or not year:
        return jsonify({'error': '缺少必要參數: state 和 year'}), 400

    # 過濾數據
    filtered = df[(df['state'] == state) & (df['year'] == int(year))]

    if filtered.empty:
        return jsonify({'error': f'找不到 {state} 在 {year} 年的數據'}), 404

    # 按 district 分組
    results = {}
    for district, group in filtered.groupby('district'):
        district_data = []
        for _, row in group.iterrows():
            district_data.append({
                'year': int(row['year']),
                'state': row['state'],
                'district': int(row['district']) if row['district'] != '0' else 'At-Large',
                'candidate': row['candidate'],
                'party': row['party'],
                'candidatevotes': int(row['candidatevotes']),
                'totalvotes': int(row['totalvotes']),
                'vote_percentage': float(row['vote_percentage'])
            })

        district_key = f"District {district}" if district != '0' else "At-Large"
        results[district_key] = district_data

    return jsonify({
        'state': state,
        'year': year,
        'districts': results,
        'total_districts': len(results)
    })


@app.route('/api/state-districts', methods=['GET'])
def get_state_districts():
    """獲取特定州和年份的所有數據"""
    state = request.args.get('state', '').upper()
    year = request.args.get('year', '')

    if not state or not year:
        return jsonify({'error': '缺少必要參數'}), 400

    filtered = df[(df['state'] == state) & (df['year'] == int(year))]

    if filtered.empty:
        return jsonify({'error': '找不到數據'}), 404

    data_list = []
    for _, row in filtered.iterrows():
        data_list.append({
            'year': int(row['year']),
            'state': row['state'],
            'district': row['district'],
            'candidate': row['candidate'],
            'party': row['party'],
            'candidatevotes': int(row['candidatevotes']),
            'totalvotes': int(row['totalvotes']),
            'vote_percentage': round(float(row['vote_percentage']), 2)
        })

    return jsonify({'data': data_list, 'count': len(data_list)})


@app.route('/api/stats', methods=['GET'])
def get_stats():
    """
    獲取數據統計信息
    """
    return jsonify({
        'total_records': len(df),
        'states': df['state'].nunique(),
        'years': sorted(df['year'].unique().tolist()),
        'total_elections': len(df[df['office'] == 'US HOUSE'])
    })


@app.route('/', methods=['GET'])
def index():
    """
    API 文檔
    """
    return jsonify({
        'message': '美國眾議院選舉數據 API',
        'endpoints': {
            '/api/states': '獲取所有州',
            '/api/years': '獲取所有年份',
            '/api/election-data?state=ALABAMA&year=2020': '獲取特定州年份的選舉數據（按選區分組）',
            '/api/state-districts?state=ALABAMA&year=2020': '獲取特定州年份的所有數據（表格格式）',
            '/api/stats': '獲取數據統計'
        }
    })


if __name__ == '__main__':
    print("""
    選舉數據 API 服務器   okokok  喔
    """)

    print("📊 數據統計:")
    print(f"   - 總記錄數: {len(df)}")
    print(f"   - 州數: {df['state'].nunique()}")
    print(f"   - 年份: {sorted(df['year'].unique().tolist())}")

    print("\n🚀 啟動服務器...")
    print("   訪問地址: http://127.0.0.1:5000")
    print("   API 文檔: http://127.0.0.1:5000/api")

    app.run(debug=True, port=5000)