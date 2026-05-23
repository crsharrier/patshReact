// https://www.w3.org/TR/WCAG20-TECHS/G17.html

/**
 * RGB Values.  Each number is a number between 0.0 to 1.0
 */
type Rgb = { r: number; g: number; b: number };
/**
 * HSL Values.
 * @property h hue 0 to 360
 * @property s saturation 0.0 to 1.0
 * @property l luminiance 0.0 to 1.0
 */
type Hsl = { h: number; s: number; l: number };
/**
 * Given a sRGB hex code convert to RGB
 * @param hex
 * @returns
 */
export const hexToRgb = (hex: string): Rgb => {
    const match = hex
        .toLowerCase()
        .match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/);
    if (!match) {
        throw new Error(`Invalid hex color: ${hex}`);
    }
    return {
        r: parseInt(match[1], 16) / 255.0,
        g: parseInt(match[2], 16) / 255.0,
        b: parseInt(match[3], 16) / 255.0,
    };
};

/**
 *
 * @param rgb
 * @returns
 */
export const rgbToHex = (rgb: Rgb): string => {
    return (
        "#" +
        Math.round(rgb.r * 255.0).toString(16) +
        Math.round(rgb.g * 255.0).toString(16) +
        Math.round(rgb.b * 255.0).toString(16)
    );
};

const luminance = (rgb: Rgb): number => {
    const r =
        rgb.r <= 0.03928
            ? rgb.r / 12.92
            : Math.pow((rgb.r + 0.055) / 1.055, 2.4);
    const g =
        rgb.g <= 0.03928
            ? rgb.g / 12.92
            : Math.pow((rgb.g + 0.055) / 1.055, 2.4);
    const b =
        rgb.b <= 0.03928
            ? rgb.b / 12.92
            : Math.pow((rgb.b + 0.055) / 1.055, 2.4);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrastRatio = (c1: Rgb, c2: Rgb): number => {
    const l1 = luminance(c1);
    const l2 = luminance(c2);
    if (l1 > l2) {
        return (l1 + 0.05) / (l2 + 0.05);
    } else {
        return (l2 + 0.05) / (l1 + 0.05);
    }
};

/**
 * https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB_alternative
 * @param hsl
 * @returns
 */
export const hslToRgb = (hsl: Hsl): Rgb => {
    const f = (n: number): number => {
        const k = (n + hsl.h / 30) % 12;
        const a = hsl.s * Math.min(hsl.l, 1 - hsl.l);
        return hsl.l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    };
    return {
        r: f(0),
        g: f(8),
        b: f(4),
    };
};

export const rgbToHsl = (rgb: Rgb): Hsl => {
    // Minimum and Maximum RGB values are used in the HSL calculations

    const min = Math.min(rgb.r, Math.min(rgb.g, rgb.b));
    const max = Math.max(rgb.r, Math.max(rgb.g, rgb.b));

    // Calculate the Hue

    let h: number = 0;

    if (max === min) {
        h = 0;
    } else if (max === rgb.r) {
        h = ((60 * (rgb.g - rgb.b)) / (max - min) + 360) % 360;
    } else if (max === rgb.g) {
        h = (60 * (rgb.b - rgb.r)) / (max - min) + 120;
    } else if (max === rgb.b) {
        h = (60 * (rgb.r - rgb.g)) / (max - min) + 240;
    }
    // Calculate the Luminance
    const l = (max + min) / 2;

    // Calculate the Saturation

    let s: number;
    if (max == min) {
        s = 0;
    } else if (l <= 0.5) {
        s = (max - min) / (max + min);
    } else {
        s = (max - min) / (2 - max - min);
    }
    return { h, s, l };
};

/**
 * Given an RGB value, find the luminance value for HSL where
 * the luminance matches that of gray.
 */
export const hslWithIdealLuminance = (rgb: Rgb): Hsl => {
    const grayRgb = { r: 0.5, g: 0.5, b: 0.5 };
    const grayLuminance = luminance(grayRgb);
    const delta = 0.0000000001;

    let currentLuminance = luminance(rgb);

    const hsl = rgbToHsl(rgb);
    if (currentLuminance > grayLuminance) {
        while (currentLuminance > grayLuminance) {
            hsl.l -= delta;
            currentLuminance = luminance(hslToRgb(hsl));
        }
    } else if (currentLuminance < grayLuminance) {
        while (currentLuminance < grayLuminance) {
            hsl.l += delta;
            currentLuminance = luminance(hslToRgb(hsl));
        }
    }
    return hsl;
};

// const whiteRgb = hexToRgb("#ffffff");
// const blackRgb = hexToRgb("#000000");
// const grayRgb = { r: 0.5, g: 0.5, b: 0.5 };
// console.log(JSON.stringify(hexToRgb("#ffffff")));
// console.log(JSON.stringify(hexToRgb("#000000")));
// console.log(JSON.stringify(hexToRgb("#808080")));
// console.log(rgbToHex({ r: 0.5, g: 0.5, b: 0.5 }));
// console.log(contrastRatio(whiteRgb, blackRgb));
// console.log(contrastRatio(blackRgb, whiteRgb));
// console.log(contrastRatio(blackRgb, grayRgb));
// console.log(contrastRatio(whiteRgb, grayRgb));
// console.log(rgbToHsl(grayRgb));
// console.log(hslToRgb(rgbToHsl(grayRgb)));
// console.log(hslToRgb(hslWithIdealLuminance(grayRgb)));
