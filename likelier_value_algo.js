function tst() {
    let test = Math.ceil(Math.random() * 10);
    if ((test > 0) && (test < 4)) {
        return Math.ceil(Math.random() * 5) + 5;
    } else {
        return Math.ceil(Math.random() * 5);
    }
}