

let h = device.height;
let w = device.width;



h_move_1(w / 2, 10, w / 2, h * 0.6)

sleep(2000)

h_move_2(w / 2, h*0.6, w / 2, 10)

function h_move_1(x1, y1, x2, y2) {
   swipe(random(x1 - 25, x1 + 25), y1, random(x2 - 25, x2 + 25), random(y2 - 25, y2 + 25), random(400, 500))
}

function h_move_2(x1, y1, x2, y2) {
    swipe(random(x1 - 25, x1 + 25), random(y1 - 25, y1 + 25), random(x2 - 25, x2 + 25),y2, random(400, 500))
}