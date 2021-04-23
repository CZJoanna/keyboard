$(document).ready(function () {
  //設全域變數count累計鍵盤被按的次數
  let count = 0;
  //用陣列儲存每次比對(r/w)的結果
  let countArea = [];
  //抓取打字測驗區的字串
  let justType = document.getElementById("typeArea").innerText;
  //空字串 用來儲存已處理的字元
  let myTextChange = "";

  // keypress 字母大小寫的keycode不一樣
  // keydown   會一樣
  $(document).on("keypress", (e) => {
    //黃色圈圈顯示KEY & KEYCODE
    $("#keyBox").text(e.key);
    $("#keycodeBox").text(e.keyCode);
  });

  //監聽鍵盤keydown事件: 按鍵特效
  $(document).on("keydown", (e) => {
    let mykey = e.key; //type:String
    //設定每個按鍵div的id與e.key相同，藉此抓到相對應的元素
    //大寫字母與小寫字母在同一個按鍵上，所以不管keydown顯示的是大寫還是小寫，
    //如果id設定是大寫字母，就要在抓取元素的時候用toUpperCase()，反之就用toLowerCase
    let target = document.getElementById(mykey.toLowerCase());

    //抓取該元素的class
    let testBtn = $(target).prop("class");
    let doubleKey = $(target).parent().prop("class");

    //在目標元素新增一個會改變顏色的class、並訂計時器在3秒後移除掉該class
    function addAndRemove() {
      $(target).addClass(" changeBgc ");
      setTimeout(function () {
        $(target).removeClass("changeBgc");
      }, 300);
    }

    //字母&功能區
    if (testBtn == "keyalpha") {
      addAndRemove();
    }
    if (testBtn == "keybtn") {
      addAndRemove();
    }

    //一個按鍵上有兩個字元的特效
    if (doubleKey == "dolkey") {
      $(target).parent().addClass("changeBorder");
      $(target).addClass("changeColor");

      setTimeout(function () {
        $(target).parent().removeClass("changeBorder");
        $(target).removeClass("changeColor");
      }, 300);
    }
  });

  //對caps lock監聽 (註:使用jquery監聽方式無效)
  document.addEventListener("keydown", function (e) {
    //抓取大寫鍵
    let temp = document.getElementById("capslock");

    //抓取所有字母鍵
    let myalpha = document.getElementsByClassName("keyalpha");

    //設變數x偵測[電腦目前Caps Lock鍵狀態]
    let x = e.getModifierState("CapsLock");

    if (x === true) {
      //圈圈的燈變亮
      $(temp).addClass("changeBgc");
      //把字母區設定為燈亮變大寫
      for (let i = 0; i < myalpha.length; i++) {
        myalpha[i].innerText = myalpha[i].innerText.toUpperCase();
      }
    } else {
      //圈圈的燈變暗
      $(temp).removeClass("changeBgc");
      //把字母區設定為燈暗變小寫
      for (let i = 0; i < myalpha.length; i++) {
        myalpha[i].innerText = myalpha[i].innerText.toLowerCase();
      }
    }
  });

  //監聽鍵盤keydown事件: 比對字元對錯
  $(document).on("keydown", function (e) {
    //按到的字元
    let mykey = e.key;

    //函式 跳出結束視窗
    function showAlert() {
      $(".alert").addClass("visibility");
    }

    //函式 關閉結束視窗
    function closeAlert() {
      $(".alert").removeClass("visibility");
    }

    //檢查按到哪一個字
    // console.log(`index:${count}, 你現在按到第${count + 1}個字:${justType[count]}。你按的是:${mykey}`);

    //插入span 前段標籤
    // 答對(綠)
    // 答對(紅)
    let beSpanG = `<span class = "highlightG">`;
    let beSpanR = `<span class = "highlightR">`;

    //要變色的字
    let myText = justType[count];

    //插入span後段標籤
    let afSpan = `</span>`;

    //未處理的字
    let afText = justType.slice(count + 1, justType.length);

    //進行字元比對
    let nbsp = String.fromCharCode(160);
    let br = String.fromCharCode(10);

    // 函式:字元比對
    function changeColor(color) {
      // 對該字元進行span包裝(beSpan+myText+afSpan)
      // 每次處理完的字元都會被加進myTextChange
      myTextChange += color + myText + afSpan;

      // 將處理後的字串(myTextChange)與處理前的字串(afText)組合起來
      let myColorText = myTextChange + afText;
      // 顯示到頁面
      document.getElementById("typeArea").innerHTML = myColorText;
    }

    //比對正確:
    if (
      justType[count] == mykey &&
      ("CapsLock" != mykey || "Shift" != mykey || "Backspace" != mykey) &&
      count < justType.length
    ) {
      // 新增顏色(綠)
      changeColor(beSpanG);
      //新增比對結果(對)
      countArea.push("r");

      count += 1;
    } else if (mykey == " " && justType[count] == nbsp) {
      // ----nbsp判斷----
      // 新增顏色(綠)
      changeColor(beSpanG);
      //新增比對結果(對)
      countArea.push("r");

      count += 1;
    } else if (
      //比對為capslock或shift
      (mykey == "CapsLock" || mykey == "Shift") &&
      count < justType.length
    ) {
      // 不算次數
      count = count;

      //比對為Backspace
    } else if (mykey == "Backspace" && count < justType.length) {
      count -= 1;
      // 把一個套上span拿掉
      myTextChange = myTextChange.slice(0, -35);
      // 未被處理的字
      let backAfText = justType.slice(count, justType.length);
      // 組合並顯示
      let myColorText = myTextChange + backAfText;
      document.getElementById("typeArea").innerHTML = myColorText;
      // console.log(`原本有這些:${myTextChange}`)
      // console.log(`現在剩這樣:${beCutText}`);
      // console.log(`被切的字:${myTextChange.slice(-35)} 要變空字串:${blankText}`);
      // console.log(`後面黏貼的字:${backAfText}`);

      // 規定count最低次數不得小於0，確保比對的正確性
      if (count < 0) {
        count = 0;
        //維持初始狀態
        document.getElementById("typeArea").innerHTML = justType;
      }
      // 將上一個按鍵的結果拿掉
      countArea.pop();

      //比對錯誤
    } else if (justType[count] != mykey && count < justType.length) {
      // 新增顏色(紅)
      changeColor(beSpanR);
      //新增比對結果(錯)
      countArea.push("w");
      count += 1;
    }

    let rightChar = 0;
    let wrongChar = 0;
    //函式 計算對和錯的字元各有幾個
    function finCount() {
      for (let i = 0; i < countArea.length; i++) {
        if (countArea[i] == "r") {
          rightChar += 1;
        } else {
          wrongChar += 1;
        }
      }

      document.getElementById(
        "score"
      ).innerText = `答對字數: ${rightChar}   答錯字數: ${wrongChar}`;
      // 陣列清空重新計算
      countArea = [];
    }

    //關閉結束視窗 重新計算按鈕次數
    // 註: 把關閉放在開啟前面是因為count會在開啟視窗後直接加一，如果
    // 使用者在最後一個鍵按下space，會導致開啟結果視窗和關閉結果視窗直接作用。
    if (count > justType.length && mykey == "Enter") {
      //關閉通知結果的視窗
      closeAlert();

      //將儲存的變色字串清空
      myTextChange = "";

      //初始化測驗區
      document.getElementById("typeArea").innerHTML = justType;

      //重新計算按下的次數
      count = 0;
    } else if (count > justType.length && mykey != "Enter") {
      console.log("按enter關閉");
    }

    //開啟結束視窗
    if (count == justType.length) {
      // console.log(`本次測驗結束`);
      //計算測驗結果
      finCount();
      //開啟通知結果的視窗
      showAlert();

      count += 1;
    }

    // 檢查
    console.log(`比對index=${count}的字:${justType[count]}`);
    // console.log(justType[count].length);
  });
});
