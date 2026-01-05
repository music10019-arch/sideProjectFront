const width = 1200;
const height = 800;

// 創建 SVG
// .attr 屬性設定
const svg = d3.select('#map')
    //你的專案目前只有一個 <svg>，所以其實兩種都可以：
    .attr('width', width)
    .attr('height', height);


// 創建投影和路徑生成器  專有名詞，不管
// JSON 裡儲存的是什麼？ 地球上真實的地理座標（經度、緯度）。 但 地球是球面，SVG 是平面  所以要先projection
const projection = d3.geoAlbersUsa()
    .scale(1500)
    .translate([width / 2, height / 2])
// .fitSize([width, height], {
//     type: 'Sphere'
// });
// geoPath = 地理路徑生成器 : 平面座標 → SVG 指令
// 效果：之後可以用 pathGenerator 來處理 JSON 州份   會在 .attr('d', pathGenerator 被使用!!!!!!!!!!!
const pathGenerator = d3.geoPath()
    .projection(projection);

// states10m.json 本是一個 TOPOJSON檔
// d3.json() 是通用 JSON 讀取函式，不限於特定格式
// 用d3.json 加載檔案 ； d3之後 + .then 表示給回傳的value一個參數，暫時叫他topology
d3.json('states10m.json').then(topology => {
    // 將 TopoJSON 轉換為 GeoJSON ; 你要轉檔案格式 → 用 topojson.feature()
    const states = topojson.feature(topology, topology.objects.states).features;
    ///////  為 在 topology 物件中，找到 objects這個屬性，再找到states資料集
    ///////  需要對states10 架構 有所認識 arc 邊界
    ///  const states = topojson.feature(topology, topology.objects.states)  已經轉成GeoJSON
    /// 此geo 架構: 第一層：FeatureCollection 物件（外層）; 第二層：features 陣列內的每個 Feature（內層）
    ///  每個 Feature 代表一個州，包含該州的幾何資訊和屬性。 最後的.features 代表把他取出來


    ////////////   TopoJSON:檔案要下載傳輸時用（檔案小） 例：網頁地圖應用  ;
    ////////////   GeoJSON:需要清楚讀取和編輯資料時用，例：API 回傳地理資料、地圖編輯工具
    // 繪製州份
    svg.selectAll('.state')
        ///  但目前沒有這樣的元素（因為還沒創建），所以是空選擇
        .data(states)
        /// .data(states) 需要的是陣列資料，而 const states= 的~是已經轉成 GeoJSON 的 Feature 物件陣列
        .enter()
        /// 進入創建新元素的模式
        .append('path')
        ///創建一個 <path> SVG 元素，所以會生成 50 個 <path>，        內容是 <path> </path>
        .attr('class', 'state')
        /// 添加 class 屬性，      <path class="state">    </path> 共50個
        .attr('d', pathGenerator)
        ///  對每一個.state 都給予d屬性的內容
        ///  path 必須用 d 屬性 description（描述）;
        .on('mouseover', function (event, qqq) {
            /// 當mouseover時，執行有event、qqq 兩個參數的函數function 如下:  ////////
            const tooltip = d3.select('#tooltip');
            tooltip
                .style('display', 'block')
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px')
                .text(qqq.properties.name);
            ///  如果有滑鼠事件，給qqq 數值內容: properties.name 即"州名"
            ///  d3.select(this) 表示 被選到的東西 跟tooltip  額外跑出來的東西 不一樣
            d3.select(this)
                .style('fill', '#ff6b6b')
                .style('stroke-width', '1.5px');
        })

        .on('mousemove', function (event) {
            //////  讓你在同一個州裡面亂跑 tooltip 依然跟著跑 (會觸發很多次 滑鼠一有小小動 就會觸發)
            d3.select('#tooltip')
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');
        })

        .on('mouseout', function () {
            ////Mouseout 做兩件事: 把州的顏色改回來、隱藏 tooltip
            d3.select('#tooltip')
                .style('display', 'none');
            d3.select(this)
                .style('fill', '#e8f4f8')
                .style('stroke-width', '0.5px')
        })
        .on('click', function (event, qqq) {
            d3.select(this)
                .style('fill', '#ffd700')     // 金色
                .style('stroke-width', '2px');
            console.log('點擊了：' + qqq.properties.name)
        })

        // 地圖點擊事件
        .on('click', function (event, d) {
            const theStateName = d.properties.name; // 取得州名
            SelectState(theStateName);  // 呼叫 election-data.js 的函數
        });






}).catch(error => {
    ////   d3.json('states10m.json').then(topology => {   是成功時執行的代碼
    console.error('Error loading the map:', error);
    alert('無法加載地圖檔案。有錯誤喔!!!');
});
//// .catch() 的參數不一定要叫 error，可以改 .catch(problema =>  或是 .catch(x =>
//// .finally(() => {   後面加的東西:不管成功或失敗，都會執行，不需接收參數