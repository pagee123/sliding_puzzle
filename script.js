const container = document.getElementById("puzzle-container");  //取得HTML內id為puzzle-container之標籤位置
const size = 3;     //拼圖之長寬
let tiles = [];     //對應每塊拼圖之位置與值
let imageSrc = "";      //初始image之變數
const tileSize = 300 / size;        //設置每個拼圖之大小

// 初始化拼圖
function init() {
    tiles = [];
    for (let i = 0; i < size * size - 1; i++) {
        tiles.push(i);      //經過size在tile填入(size * size - 1)之值
    }
    tiles.push(null);       // 最後一格為填入空白
    render();               // 渲染拼圖
}

// 渲染拼圖
function render() {
    container.innerHTML = "";       //使用innerHTML來修改元素內容
    tiles.forEach((index, i) => {                       //遍歷tile內之資料(index)
        const tile = document.createElement("div");     //創建一個新的div元素
        tile.className = "tile";        //對值為i這個位置加入tile css 類別
        
        if (index !== null) {
            // 設置背景圖片的位置
            const row = Math.floor(index / size);       //floor 捨去小數點，取得列位置
            const col = index % size;       //取得行位置
            tile.style.backgroundImage = `url(${imageSrc})`;        //設定背景圖片
            tile.style.backgroundPosition = `-${col * tileSize}px -${row * tileSize}px`;        //切個符合行列位置的圖片
            tile.addEventListener("click", () => move(i));      //對每格做點擊監聽，點擊後作move(i)函數
        } else {
            tile.classList.add("empty");        //對值為null這個位置加入empty css 類別
        }
        
        container.appendChild(tile);        //把tile元素加入到container元素中
    });
}

// 處理圖片上傳
function handleImageUpload(event) {     
    const file = event.target.files[0];     //取得引入之第一個圖片放入file
    const reader = new FileReader();        
    /*
    FileReader是一個瀏覽器提供的API，用於讀取本地檔案（例如文字、圖片）
    這個實例可以用來：
        讀取檔案內容⁠
        當檔案讀取完成時，會觸發onload事件⁠
        可以使用readAsDataURL()方法將檔案轉換為Data URL格式，特別適合用於處理圖片檔案⁠
    */
    reader.onload = function (e) {
        imageSrc = e.target.result;
        /*
        接收一個事件參數e，其中e.target.result包含了檔案的資料⁠
        將檔案資料（如果是圖片，則是Base64格式的URL）存入imageSrc變數⁠
        這樣存儲的圖片資料後續可以直接用於設定拼圖格子的背景圖片⁠
        */
        init(); // 重新初始化拼圖
    };
    reader.readAsDataURL(file);     //將檔案轉換為Data URL格式
}

// 打亂拼圖
function shuffle() {
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));      //得到一個 0 到 i+1 之間的隨機數
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];        //交換i與j內的值
    }
    render();       // 渲染拼圖
}

// 移動方塊
function move(index) {
    const emptyIndex = tiles.indexOf(null);     //找出值為null之位置
    const validMoves = [index - 1, index + 1, index - size, index + size];      //取得index位置之上下左右格是否有可以交換的格子

    if (validMoves.includes(emptyIndex) && isValidMove(index, emptyIndex)) {        //判斷是否可移動格子
        [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];      //交換所選格與null格之位置
        render();       // 重新渲染拼圖

        if (checkWin()) {       // 檢查拼圖是否完成
            setTimeout(() => alert("Congratulations! You solved the puzzle!"), 100);
            /*
            setTimeout是一個延遲執行函數的方法，在這個例子中：
                在拼圖完成後，延遲100毫秒才彈出勝利提示框⁠
                使用setTimeout的目的是避免立即觸發提示框，讓畫面有足夠的時間完成渲染⁠
            */
        }
    }
}

// 檢查是否為有效移動
function isValidMove(index, emptyIndex) {
    const colDiff = Math.abs((index % size) - (emptyIndex % size));     //取得該格子與空格之垂直距離的絕對值。
    const rowDiff = Math.abs(Math.floor(index / size) - Math.floor(emptyIndex / size));     //取得該格子與空格之水平距離的絕對值。
    return colDiff + rowDiff === 1;
    /*
    若水平距離 + 垂直距離等於 1，則表示目標格子和空格相鄰，可以移動。
    如果距離大於 1，則目標格子和空格不相鄰，無法移動。
    */
}

// 檢查拼圖是否完成
function checkWin() {
    for (let i = 0; i < tiles.length - 1; i++) {
        if (tiles[i] !== i) return false;       //判斷tile[i]值內是否為i，達到檢查拼圖是否完成
    }
    return true;
}

init();