let window = floaty.rawWindow(
    <vertical>
        <button id="btn" padding="10">
            点我
        </button>
        <button id="move" padding="10">
            移动
        </button>
    </vertical>
);

window.btn.click(function () {
    btnAction();
});