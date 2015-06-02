/**
 */

e =
    (imgData2.data[i+2] < 128) ? (2 * imgData1.data[i+2] * imgData2.data[i+2] / 255) : (255 - 2 * (255 - imgData1.data[i+2]) * (255 - imgData2.data[i+2]) / 255)