function tst2() {
    let test = Math.ceil(Math.random() * 10);
    if ((test > 0) && (test < 4)) {
        return Math.ceil(Math.random() * 300) + 100;
    } else {
        return Math.ceil(Math.random() * 600) + 400;
    }
}