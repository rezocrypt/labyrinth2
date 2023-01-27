var lab = []
var wall_ends = []
var canvas_height = 800
var canvas_width = 800
var height = 31
var width = 31
var center_coords = [[width / 2 - 0.5, height / 2 - 0.5], [width / 2 - 0.5 - 1, height / 2 - 0.5], [width / 2 - 0.5 + 1, height / 2 - 0.5], [width / 2 - 0.5, height / 2 - 0.5 - 1], [width / 2 - 0.5 - 1, height / 2 - 0.5 - 1], [width / 2 - 0.5 + 1, height / 2 - 0.5 - 1], [width / 2 - 0.5, height / 2 - 0.5 + 1], [width / 2 - 0.5 - 1, height / 2 - 0.5 + 1], [width / 2 - 0.5 + 1, height / 2 - 0.5 + 1]]
var block = canvas_width / width
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var colors = { 0: "white", 1: "black", 2: "green", 3: "orange", 4: "red", 5: "lime",6:"pink",7:"red" }
var player_x = 0
var player_y = 0

ctx.beginPath();


function create_labyrinth_matrix() {
    for (let y = 0; y < height; y++) {
        let a = []
        for (let x = 0; x < width; x++) {
            a[x] = [0, 0]
            center_coords.forEach(element => {
                if (element[0] == x && element[1] == y) {
                    a[x] = [2, 0]
                }
            });
            if ([x, y] in center_coords) {
                a[x] = [2, 0]
            }
        }
        lab[y] = a
    }
    lab[0][0][0] = 5
}


function update() {
    ctx.clearRect(0, 0, canvas_width, canvas_height);
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (lab[y][x][0] == 0 && lab[y][x][1] == 0 && lab[y][x][1] == 1) {
                continue;
            }
            ctx.fillStyle = colors[lab[y][x][0]]
            if (lab[y][x][1] > 0) {
                ctx.fillStyle = colors[lab[y][x][1]+5]
            }
            ctx.fillRect(x * block, y * block, block, block);
            ctx.stroke()
        }
    }
}

function random_number(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function draw_line(x, y, length, type = 0) {
    if (type == 0) {
        for (let i = y; i < y + length; i++) {
            lab[i][x][0] = 1
            center_coords.forEach(element => { if (element[0] == x && element[1] == i) { lab[i][x][0] = 2 } });
        }
        wall_ends.push([x, y])
        wall_ends.push([x, y + length - 1])

    }

    if (type == 1) {
        for (let i = x; i < x + length; i++) {
            lab[y][i][0] = 1
            center_coords.forEach(element => { if (element[0] == i && element[1] == y) { lab[y][i][0] = 2 } });
        }
        wall_ends.push([x, y])
        wall_ends.push([x + length - 1, y])
    }

    if (type == 2) {
        for (let i = 0; i < length; i++) {
            lab[y + i][x + i][0] = 1
            center_coords.forEach(element => { if (element[0] == x + i && element[1] == y + i) { lab[y + i][x + i][0] = 1 } });
        }
        wall_ends.push([x, y])
        wall_ends.push([x + length - 1, y + length - 1])
    }

    if (type == 3) {
        let b = 0
        wall_ends.push([x, y])
        for (let i = 0; i < length; i++) {
            if ((y - i) < 0) {
                wall_ends.push([x + i - 1, y - i + 1])
                b = 1
                break
            }
            lab[y - i][x + i][0] = 1
            center_coords.forEach(element => { if (element[0] == x + i && element[1] == y - i) { lab[y - i][x + i][0] = 2 } });
        }
        if (b == 0) {
            wall_ends.push([x + length - 1, y - length + 1])

        }
    }
}

function generate_labyrinth() {
    for (let i = 0; i < 10; i++) {
        try {
            draw_line(random_number(1, width * 0.8), random_number(1, height * 0.8), random_number(1, height * 0.2), random_number(0, 4))
        } catch (error) {
        }
    }
    wall_ends = wall_ends.filter((t = {}, a => !(t[a] = a in t)))

}

function find_distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
}

function check_point_touch(point) {
    if (player_x == point[0] && player_y == point[1]) { return true }
    if (player_x == point[0] + 1 && player_y == point[1]) { return true }
    if (player_x == point[0] - 1 && player_y == point[1]) { return true }
    if (player_x == point[0] && player_y == point[1] + 1) { return true }
    if (player_x == point[0] + 1 && player_y == point[1] + 1) { return true }
    if (player_x == point[0] - 1 && player_y == point[1] + 1) { return true }
    if (player_x == point[0] && player_y == point[1] - 1) { return true }
    if (player_x == point[0] + 1 && player_y == point[1] - 1) { return true }
    if (player_x == point[0] - 1 && player_y == point[1] - 1) { return true }
    return false
}


function find_nearest_point() {
    let points = []
    for (let i = 0; i < wall_ends.length; i++) {
        lab[wall_ends[i][1]][wall_ends[i][0]][0] = 3
        points[i] = find_distance(player_x, player_y, wall_ends[i][0], wall_ends[i][1])
    }
    let best_move = wall_ends[points.indexOf(Math.min(...points))]
    if (check_point_touch(best_move)) {
        console.log("XOLODOKf");
        console.log()
        wall_ends.splice(wall_ends.indexOf(best_move),1)
        return find_nearest_point()
    }
    if (find_distance(player_x,player_y,best_move[0],best_move[1]) >= find_distance(player_x,player_y,width / 2 - 0.5, height / 2 - 0.5)) {
        best_move = [width / 2 - 0.5, height / 2 - 0.5]
    }
    lab[best_move[1]][best_move[0]][0] = 4
    return best_move
}

function check_win() {
    for (let i = 0; i < center_coords.length; i++) {
        if (check_point_touch(center_coords[i][0],center_coords[i][1])){
            return true
        }
    }
    return false
}

function find_valid_steps() {
    let all_steps = []
    let valid_steps = []
    all_steps.push([player_x - 1, player_y])
    all_steps.push([player_x + 1, player_y])
    all_steps.push([player_x, player_y - 1])
    all_steps.push([player_x, player_y + 1])
    for (let i = 0; i < all_steps.length; i++) {
        if (all_steps[i][0] < 0) {
            continue
        }
        if (all_steps[i][1] < 0) {
            continue
        }
        if (all_steps[i][0] > width) {
            continue
        }
        if (all_steps[i][1] > height) {
            continue
        }
        if (lab[all_steps[i][1]][all_steps[i][0]][1] >= 2) {
            continue
        }
        if (lab[all_steps[i][1]][all_steps[i][0]][0] != 0) {
            continue
        }
        valid_steps.push(all_steps[i])
    }
    return valid_steps
}

function find_best_move() {
    let valid_steps = find_valid_steps()
    let nearest_point = find_nearest_point()
    let steps_distance = []
    for (let i = 0; i < valid_steps.length; i++) {
        steps_distance.push(find_distance(nearest_point[0], nearest_point[1], valid_steps[i][0], valid_steps[i][1]))
    }
    let best_move = valid_steps[steps_distance.indexOf(Math.min(...steps_distance))]
    return best_move
}

function move_player(move) {
    lab[player_y][player_x][0] = 0
    player_x = move[0]
    player_y = move[1]
    lab[player_y][player_x][0] = 5
}

function one_step() {
    let move = find_best_move()
    move_player(move)
    lab[move[1]][move[0]][1] = lab[move[1]][move[0]][1] + 1
    update()
}

create_labyrinth_matrix()
generate_labyrinth()
update()

find_nearest_point()

setTimeout(() => {
    update()
}, 1000);