
    //DOM 요서 
    const $ = id => document.getElementById(id);
    const startBtn= $("startBtn"); 
    const resetBtn= $("resetBtn"); 
    const play= $("play"); 
    const playText= $("playText"); 
    const statusEl= $("status"); 
    const lastEl= $("last"); 
    const avgEl= $("avg"); 
    const bestEl= $("best"); 
    const historyList= $("historyList"); 




    //게임 상태 변수
    let timer = null;
    let startTime = 0;
    let waiting = false;
    const times = [];


    //상태 문구 업데이트
    const setStatu = (s) => (statusEl.textContent = s);


    // 상태 문구 업데이트
    const rndDelay = () => 600 + Math.random() * 2200;


    //기존 타이머 제거
    const clearTimer = () => {if (timer) clearTimeout(timer)};


    //UI 업데이트
    const setBackground = color => play.style.background = color;
    const setText = (msg) => (playText.textContent = msg);

//통계 업데이트 함수
const updateStats = () => {
    const last = times[0];
    lastEl.textContent = last ? `${last} ms` : `- ms`;

    if(times.length) {
        const avg = Math.round(times.reduce((a,b) => a+b, 0)/times.length);
        const best = Math.min(...times);
        avgEl.textContent = `${avg} ms`;
        bestEl.textContent = `${best} ms`;

    }else {
        avgEl.textContent = bestEl.textContent = '- ms';
    }


    // 최근 기록 리스트 푯;
    historyList.innerHTML = 
    times.map((t) => 
    `<div class="chip">${t} ms</div>`).join("");
};

// 반응 속도 기록 저장
const record = ms => {
    times.unshift(Math.round(ms));
    if(times.length > 10) times.pop();
    updateStats();
}

//모든 상태 초기화
const resetAll = () => {
    clearTimer();
    waiting = false;
    startTime = 0;
    times.length = 0;
    setBackground("");
    setText("시작 버튼을 누르거나 화면을 클릭하세요.");
    setStatu("대기");
    updateStats();
}

//대기 상태
const enterWiting = () => {
    clearTimer();
    waiting = true;
    setBackground
    ("linear-gradient(180deg, #58151a, rgba(255,255,255,0.02))");
    setText("대기중... 초록불이 되면 크릭하세요.");
    setStatu("대기 (곧 시작)");


    timer = setTimeout(() => {
        startTime = performance.now();
        setBackground
        ("linear-gradient(180deg, #052e16, rgba(255,255,255,0.02))");
        setText("지금! 클릭!");
        setStatu("클릭 대기");
        waiting = false;
    }, rndDelay())
};



const handleClick = () => {

    if(waiting) {
        clearTimer();
        setBackground("linear-gradient(180deg, #3b0f0f, rgba(255,255,255,0.02))");
        setText("성급한 클릭! 너무 빨랐습니다.");
        setStatu("성급한 클릭");


        timer = setTimeout(() => {
            setText("다시 시작하려면 시작을 누르세요.")
            setBackground("");
            setStatu("대기");
        }, 900);
        return;
    }

    if(startTime) {
        const diff = Math.round(performance.now() - startTime);
        startTime = 0;
        setBackground("");
        setText(`반응 속도: ${diff} ms`);
        setStatu("결과")
        record(diff);
        return;
    }

    enterWiting();
};

const handleKey = e => {
    if(["", "Enter"].includes(e.key)) {
        e.preventDefault();
        handleClick();
    }
};


play.addEventListener("click", handleClick);
play.addEventListener("touchstart", (e) => {
    e.preventDefault();
    handleClick();
}, { pasive: false});
startBtn.addEventListener("click", enterWiting);
resetBtn.addEventListener("click", resetAll);
window.addEventListener("keydown", handleKey);

resetAll();










































 