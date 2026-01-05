// election-data.js - 選舉數據處理模組

let electionData = [];
let currentState = null;
let currentYear = null;

// 載入 CSV 數據  + 初始化年份選單
//// then() 接一個函式作為參數。這個函式可以有一個參數（例如 data），用來 接收前面非同步操作回傳的值。
function loadElectionData() {
    d3.csv("./House_2020_24.csv")
        .then(
            data => {
                electionData = data;
                console.log(`有成功載入 ${data.length} 筆選舉數據`);
                yearSelect(); //populate year dropdown
            })

        .catch(
            error => {
                console.error("載入 CSV 失敗:", error);
                // document.getElementById('message').innerHTML = 
                // '❌ 數據載入失敗';
            });
}


// 填充年份下拉選單 populate year dropdown + 抓點選年份
function yearSelect() {
    const yearSelect = document.getElementById('year-select');
    // ... 讓set 變成 array ，new set 把 去到的所有year 去重複
    const years =
        [...new Set(electionData.map(d => d.year))].sort();
    // years 為一個 array    

    yearSelect.innerHTML = '<option value="">-- Select Year --</option>';
    //// value = 程式要讀的值，textContent = 使用者看到的文字
    years.forEach(y => {
        const newoption = document.createElement('option');
        newoption.value = y;
        newoption.textContent = y;
        yearSelect.appendChild(newoption);
        // 把 newoption 加到 yearSelect 裡面
    });

    ///////////////////////////////////
    // 監聽年份選擇  想得到"currentYear"
    // 因為監聽器綁在 yearSelect 上，target 就是 yearSelect
    yearSelect.addEventListener('change', (e) => {
        currentYear = e.target.value;
        if (currentState && currentYear) {
            displayElectionResults(currentState, currentYear);
        }
    });
}



// 當用戶點擊州時呼叫此函數 User selects a year
// 獲得 currentState 
function SelectState(theStateName) {

    currentState = theStateName.toUpperCase();
    // 更新 畫面上的 state badge
    const badge = document.getElementById('state-badge');
    badge.textContent = theStateName;
    badge.style.display = 'inline-block';

    // 如果已選年份,直接顯示結果
    if (currentYear) {
        displayElectionResults(currentState, currentYear);
    }

    // else {
    //     document.getElementById('message').innerHTML = '👆 Now choose a year';
    // }  
}


// 顯示選舉結果 display table and statistics.
function displayElectionResults(currentState, currentYear) {
    // 查詢數據 results , type是 array
    const results = electionData.filter(d =>
        // 看到 electionData.filter(d =>  知道 回傳type是 array
        d.state === currentState && d.year === currentYear
    );

    if (results.length === 0) {     // 只是意外才執行
        document.getElementById('message').innerHTML =
            `❌ 找不到 ${currentState} 在 ${currentYear} 的數據`;
        document.getElementById('result-display').style.display = 'none';
        return;
    }


    // 更新標題  !!!!真正的顯示標題!!!!!
    document.getElementById('display-title').textContent =
        `${currentState} - ${currentYear} Election Results`;

    // 分組分組
    const groups = groupByDistrict(results);

    // 渲染表格
    renderTable(groups);

    // 渲染統計
    renderStats(results);


    // 隱藏提示訊息 不管上一次成功或失敗
    // 先做一次清空，不讓舊的文字還留在畫面上
    document.getElementById('message').style.display = 'none';
    document.getElementById('result-display').style.display = 'block';
    /// 想接標題 原因是先給位置
}


// 寫方法 上面已經先選出特定州了 按該州的各選區分組  
// 但寫在外面 這個 results 是區域參數 讓我們帶入而已 切記
function groupByDistrict(results) {
    const groups = {};
    // 我們的預期 groups 是一個物件(或是一個 collection)
    // 裡面有很多 key-value pairs
    // 每個 key-value pair 包含:  key 跟  value陣列。
    results.forEach(
        r => {
            const rdist = r.district;
            if (!groups[rdist]) {
                // 為 if groups[rdist] 取出來的值 不存在
                groups[rdist] = [];  // 創建一個key 跟 空陣列

            } // else 否則甚麼事情都不用做;
            groups[rdist].push(r);
            // 最後都要push 進去
        }
    );
    return groups;
}
// groups = {
//   "1": [
//     {district: "1", candidate: "Alice", party: "DEMOCRAT"...
//     {district: "1", candidate: "Bob", party: "REPUBLICAN"...
//   "2": [
//     {district: "2", candidate: "Charlie", party: "DEMOCRAT"... 




// 渲染表格  一樣
// 這個 groups 是區域參數 讓我們帶入而已 切記
function renderTable(groups) {
    const table = document.getElementById('table-container');
    let tableContent = '';

    // 已經有了 按該州各選區分組 現在想完整呈現 :
    Object.keys(groups).forEach(key => {
        // 取 key, 也就是個dist 的選區編號 1,2,3,4...
        const districtData = groups[key];
        // districtData 是該選區的所有資料列陣列
        // 先取key 因為一個key 一個表(頭)
        tableContent +=
            `
            <div class="district-block">
                <h4>District ${key === '0' ? 'At-Large' : key}</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Candidate</th>
                            <th>Party</th>
                            <th>Votes</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        // 因為需要顏色區分所以特別設計 partyClass 同時 
        // 遍歷該選區的所有資料列
        districtData.forEach(r => {
            const partyClass =
                r.party === 'DEMOCRAT' ? 'dem'
                    : r.party === 'REPUBLICAN' ? 'rep'
                        : r.party === 'LIBERTARIAN' ? 'lib'
                            : 'other';

            tableContent += ` 
                <tr class="${partyClass}"> 
                    <td>${r.candidate}</td> 
                    <td>${r.party}</td> 
                    <td>${parseInt(r.candidatevotes).toLocaleString()}</td> 
                    <td>${parseFloat(r.vote_percentage).toFixed(2)}%</td> 
                </tr> 
            `
                ;
        });

        // 關閉標籤 才成形
        tableContent += ` 
                    </tbody> 
                </table> 
            </div> 
        `;
    });

    table.innerHTML = tableContent;
}




// // 渲染統計資訊
// function renderStats(data) {
//     const container = document.getElementById('stats-container');

//     const totalVotes = data.reduce((sum, d) => sum + parseInt(d.candidatevotes), 0);
//     const districts = new Set(data.map(d => d.district)).size;
//     const demVotes = data.filter(d => d.party === 'DEMOCRAT')
//         .reduce((sum, d) => sum + parseInt(d.candidatevotes), 0);
//     const repVotes = data.filter(d => d.party === 'REPUBLICAN')
//         .reduce((sum, d) => sum + parseInt(d.candidatevotes), 0);

//     container.innerHTML = `
//         <div class="stat-item">
//             <span class="stat-label">Total Districts:</span>
//             <span class="stat-value">${districts}</span>
//         </div>
//         <div class="stat-item">
//             <span class="stat-label">Total Votes:</span>
//             <span class="stat-value">${totalVotes.toLocaleString()}</span>
//         </div>
//         <div class="stat-item">
//             <span class="stat-label">Democrat Votes:</span>
//             <span class="stat-value dem">${demVotes.toLocaleString()} (${(demVotes / totalVotes * 100).toFixed(1)}%)</span>
//         </div>
//         <div class="stat-item">
//             <span class="stat-label">Republican Votes:</span>
//             <span class="stat-value rep">${repVotes.toLocaleString()} (${(repVotes / totalVotes * 100).toFixed(1)}%)</span>
//         </div>
//     `;
// }




// 頁面載入時執行  
// 所以本質上就是：「頁面準備好之後，執行初始化程式」。
document.addEventListener('DOMContentLoaded', () => {
    loadElectionData();
});