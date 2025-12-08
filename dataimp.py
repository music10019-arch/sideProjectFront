import pandas as pd

# 定義表頭
columns = ['year','state','state_po','state_fips','state_cen','state_ic',
           'office','district','stage','runoff','special','candidate',
           'party','writein','mode','candidatevotes','totalvotes','unofficial',
           'version','fusion_ticket']

# 讀取 txt 檔案，加上表頭
df = pd.read_csv('House_2020_24.txt', header=None, names=columns)



df['vote_percentage'] = (df['candidatevotes'] / df['totalvotes'] * 100).round(2)

# 篩選得票率 > 20% 的候選人
df_filtered = df[df['vote_percentage'] > 20]

# # 看前幾列
# print(df.head())
# # 檢查資料型態
# print(df.info())

print(df_filtered.head())
print(f"篩選後有 {len(df_filtered)} 筆記錄")

# 如果要存成 csv（可選）
df_filtered.to_csv('House_2020_24.csv', index=True)


