require('regenerator-runtime/runtime');

window.HTMLMediaElement.prototype.play = () => { /* do nothing */ };

beforeEach(() => {
    jest.useFakeTimers();
    localStorage.setItem('volume', 50);
});

afterEach(() => {
    jest.resetModules();
    jest.clearAllTimers();
});

test('start timer function', () => {
    document.body.innerHTML = `
        <button id = "start-btn">Start</button>
        <div id="timer_display_duration">25:00</div>
    `;

    require('../src/scripts/Timer');

    const startButton = document.getElementById('start-btn');
    const display = document.getElementById('timer_display_duration');

    startButton.click();

    jest.advanceTimersByTime(5000);

    expect(startButton.innerHTML).toBe('Stop');
    expect(display.innerHTML).toBe('24:55');
});

test('Stop and reset function', () => {
    document.body.innerHTML = `
        <button id = "start-btn">Stop</button>
        <button id="pomo-btn"> Pomo</button>
        <button id="break-btn"> Break</button>
        <div id="timer_display_duration">13:00</div>
    `;

    require('../src/scripts/Timer');

    const startButton = document.getElementById('start-btn');
    const display = document.getElementById('timer_display_duration');

    startButton.click();
    jest.advanceTimersByTime(100);

    expect(startButton.innerHTML).toBe('Start');
    expect(display.innerHTML).toBe('25:00');
});

test('advance in time', () => {
    document.body.innerHTML = `
        <button id = "start-btn">Start</button>
        <div id="timer_display_duration">25:00</div>
    `;

    require('../src/scripts/Timer');

    const startButton = document.getElementById('start-btn');
    const display = document.getElementById('timer_display_duration');

    startButton.click();

    // advance by 00:05
    jest.advanceTimersByTime(5000);
    expect(display.innerHTML).toBe('24:55');

    // advance by 00:55
    jest.advanceTimersByTime(55000);
    expect(display.innerHTML).toBe('24:00');

    jest.advanceTimersByTime(1000);
    expect(display.innerHTML).toBe('23:59');

    // advance by 23:00
    jest.advanceTimersByTime(1380000);
    expect(display.innerHTML).toBe('0:59');

    jest.advanceTimersByTime(59000);
    expect(display.innerHTML).toBe('0:00');
});

describe(('switch mode'), () => {
    beforeEach(() => {
        jest.useFakeTimers();
        localStorage.setItem('pomo-length', '3');
        localStorage.setItem('short-break-length', '1');
        localStorage.setItem('long-break-length', '2');
    });

    afterEach(() => {
        jest.resetModules();
        jest.clearAllTimers();
        localStorage.clear();
    });

    test('pomo section ends', async () => {
        document.body.innerHTML = `
            <button id = "start-btn">Start</button>
            <div id="timer_display_duration">3:00</div>
            <button id = "pomo-btn"> Pomo</button>
            <button style="background-color: #f3606060;" id = "break-btn"> Break</button>
        `;

        const timer = require('../src/scripts/Timer');

        const startButton = document.getElementById('start-btn');
        const display = document.getElementById('timer_display_duration');
        const pomoButton = document.getElementById('pomo-btn');
        const breakButton = document.getElementById('break-btn');

        startButton.click();
        jest.advanceTimersByTime(180000);
        expect(display.innerHTML).toBe('0:00');
        jest.runOnlyPendingTimers();
        expect(display.innerHTML).toBe('0:59');

        // expect(timer.timerStatus).toBe('break');
        const breakColor = getComputedStyle(breakButton);

        expect(breakButton.classList).toContain('toggle');
        expect(pomoButton.classList).toContain('toggle');
    });

    test('break section ends', async () => {
        document.body.innerHTML = `
            <button id = "start-btn">Start</button>
            <div id="timer_display_duration">0:01</div>
            <button id = "pomo-btn"> Pomo</button>
            <button style="background-color: #f3606060;" id = "break-btn"> Break</button>
        `;

        require('../src/scripts/Timer');

        const startButton = document.getElementById('start-btn');
        const display = document.getElementById('timer_display_duration');
        const pomoButton = document.getElementById('pomo-btn');
        const breakButton = document.getElementById('break-btn');

        startButton.click();
        jest.advanceTimersByTime(180000);
        expect(display.innerHTML).toBe('0:00');
        jest.advanceTimersByTime(60000);
        expect(display.innerHTML).toBe('0:00');
        jest.runOnlyPendingTimers();
        expect(display.innerHTML).toBe('2:59');

        expect(pomoButton.classList).not.toContain('toggle');
        expect(breakButton.classList).not.toContain('toggle');
    });

    test('switch to long break', () => {
        document.body.innerHTML = `
            <button id = "start-btn">Start</button>
            <div id="timer_display_duration">0:01</div>
            <button id = "pomo-btn"> Pomo</button>
            <button style="background-color: #f3606060;" id = "break-btn"> Break</button>
        `;

        require('../src/scripts/Timer');

        const startButton = document.getElementById('start-btn');
        const display = document.getElementById('timer_display_duration');

        startButton.click();
        // 0
        jest.advanceTimersByTime(180000);
        jest.advanceTimersByTime(60000);
        // 1
        jest.advanceTimersByTime(180000);
        jest.advanceTimersByTime(60000);
        // 2
        jest.advanceTimersByTime(180000);
        jest.advanceTimersByTime(60000);
        // 3
        jest.advanceTimersByTime(180000);
        jest.runOnlyPendingTimers();
        expect(display.innerHTML).toBe('1:59');
    });
});
