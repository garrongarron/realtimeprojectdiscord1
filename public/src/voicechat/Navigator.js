const getMedia = (
    navigator.getUserMedia || // use the proper vendor prefix
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
);

navigator.getMedia = getMedia

if (typeof navigator.getMedia == 'undefined') {
    console.error('navigator.getMedia  is undefined', navigator, navigator.getMedia);
}

export default getMedia