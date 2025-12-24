/*
 * Generate an image of random pixels based on a seed value.
 * To do this, we need a seedable PRNG - the version used here is adapted from:
 * https://gist.github.com/blixt/f17b47c62508be59987b
 */

function Random(seed) {
  this._seed = seed % 2147483647;
  if (this._seed <= 0) this._seed += 2147483646;
}

/**
 * Returns a pseudo-random value between 1 and 2^32 - 2.
 */
Random.prototype.next = function () {
  return this._seed = this._seed * 16807 % 2147483647;
};


/**
 * Returns a pseudo-random floating point number in range [0, 1).
 */
Random.prototype.nextFloat = function (opt_minOrMax, opt_max) {
  // We know that result of next() will be 1 to 2147483646 (inclusive).
  return (this.next() - 1) / 2147483646;
};

function seed_from_var(variable) {
    let output;
    switch (typeof variable) {
        case "string":
            const encoder = new TextEncoder();
            let uint8array = encoder.encode(variable);
            output = 0;
            for (let i = 0; i < uint8array.byteLength; i++) {
                output = (output + uint8array[i]) % Number.MAX_SAFE_INTEGER;
            }
            break;
        case "number":  // Weeee
        default:
            output = variable % Number.MAX_SAFE_INTEGER;
    }

    return output;
}

function create_image(seed_data, pixels_x = 0, pixels_y = 0, pixel_callback = null) {
    const prng = new Random(seed_from_var(seed_data));

    let buffer_size = pixels_x * pixels_y;
    let image_buffer = new ArrayBuffer(buffer_size * 4);
    const view = new DataView(image_buffer);
    for (let i = 0; i < buffer_size; i++) {
        let channel_vals = _get_random_color(prng);
        channel_vals.push(255);

        if (pixel_callback !== null) {
            channel_vals = pixel_callback(channel_vals);
        }
        for (j = 0; j < 4; j++) {
            view.setUint8(4*i + j, channel_vals[j], false);
        }
    }

    let image = new ImageData(new Uint8ClampedArray(image_buffer), pixels_x, pixels_y);
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext('2d');
    ctx.putImageData(image, 0, 0);
    return canvas.toDataURL("image/png");
}

function _get_random_color(prng) {
    let output = [];
    for (let i = 0; i < 3; i++) {
        output.push(prng.next() % 256);
    }
    return output;
}

function get_random_color(seed_data) {
    const prng = new Random(seed_from_var(seed_data));
    return _get_random_color(prng);
}