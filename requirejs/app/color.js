define([], function () {

    // Declaration of the enumeration representing the color of the player
    var ColorEnum = {
        BLACK: { value: 0, name: 'Black', code: 'B', delay: 0, energy: 0 },
        RED: { value: 1, name: 'Red', code: 'R', delay: 400, energy: 1 },
        BLUE: { value: 3, name: 'Blue', code: 'Bl', delay: 800, energy: 5 },
        GREEN: { value: 2, name: 'Green', code: 'G', delay: 600, energy: 3 },
        YELLOW: { value: 4, name: 'Yellow', code: 'Y', delay: 500, energy: 2 },
        CYAN: { value: 5, name: 'Cyan', code: 'C', delay: 700, energy: 4 },
        MAGENTA: { value: 6, name: 'Magenta', code: 'M', delay: 900, energy: 6 },
        WHITE: { value: 7, name: 'White', code: 'W', delay: 300, energy: 7 }
    }


    function subAdditiveColorMagenta(color1, color2) {
        return color1.name == 'Red' && color2.name == 'Blue';
    }

    function subAdditiveColorYellow(color1, color2) {
        return color1.name == 'Red' && color2.name == 'Green';
    }

    function subAdditiveColorCyan(color1, color2) {
        return color1.name == 'Blue' && color2.name == 'Green';
    }


    /// @function additiveColor
    /// Returns the color obtain when we add the two colors in argument
    function additiveColor(oldColor, newColor) {
        if (subAdditiveColorMagenta(oldColor, newColor) || subAdditiveColorMagenta(newColor, oldColor)) {
            return ColorEnum.MAGENTA;
        }

        if (subAdditiveColorCyan(oldColor, newColor) || subAdditiveColorCyan(newColor, oldColor)) {
            return ColorEnum.CYAN;
        }

        if (subAdditiveColorYellow(oldColor, newColor) || subAdditiveColorYellow(newColor, oldColor)) {
            return ColorEnum.YELLOW;
        }

        if ((oldColor.name == 'Magenta' && newColor.name == 'Green') || (oldColor.name == 'Yellow' && newColor.name == 'Blue') || (oldColor.name == 'Cyan' && newColor.name == 'Red')) {
            return ColorEnum.WHITE;
        }

        if (oldColor.name == 'Magenta' || oldColor.name == 'Cyan' || oldColor.name == 'Yellow' || oldColor.name == 'White') {
            return oldColor;
        }

        return newColor;
    }

    /// @function subFilterColor
    /// Returns the color obtained when the light of color "playerColor" passes through a optical filter of color "color"
    /// @return Element of the enumeration ColorEnum representing the filtered color
    /// @param {Object} Element of the enumeration ColorEnum representing the initial color
    /// @param {Object} Element of the enumeration ColorEnum representing the filter color
    /// Assumes that the intial color is correctly defined
    function subFilterColor(playerColor, color) {

        if (color == null) {
            return null;
        }

        switch (playerColor) {
            case ColorEnum.RED:
                if (color == ColorEnum.RED || color == ColorEnum.MAGENTA || color == ColorEnum.YELLOW) {
                    return ColorEnum.RED;
                }
                break;
            case ColorEnum.BLUE:
                if (color == ColorEnum.BLUE || color == ColorEnum.MAGENTA || color == ColorEnum.CYAN) {
                    return ColorEnum.BLUE;
                }
                break;
            case ColorEnum.GREEN:
                if (color == ColorEnum.GREEN || color == ColorEnum.CYAN || color == ColorEnum.YELLOW) {
                    return ColorEnum.GREEN;
                }
                break;

            case ColorEnum.MAGENTA:
                if (color == ColorEnum.RED || color == ColorEnum.BLUE) {
                    return color;
                }
                if (color == ColorEnum.MAGENTA) {
                    return color;
                }
                if (color == ColorEnum.CYAN) {
                    return ColorEnum.BLUE;
                }
                if (color == ColorEnum.YELLOW) {
                    return ColorEnum.RED;
                }
                break;

            case ColorEnum.YELLOW:
                if (color == ColorEnum.GREEN || color == ColorEnum.RED) {
                    return color;
                }
                if (color == ColorEnum.YELLOW) {
                    return color;
                }
                if (color == ColorEnum.CYAN) {
                    return ColorEnum.GREEN;
                }
                if (color == ColorEnum.MAGENTA) {
                    return ColorEnum.RED;
                }
                break;

            case ColorEnum.CYAN:
                if (color == ColorEnum.GREEN || color == ColorEnum.BLUE) {
                    return color;
                }
                if (color == ColorEnum.CYAN) {
                    return color;
                }
                if (color == ColorEnum.MAGENTA) {
                    return ColorEnum.BLUE;
                }
                if (color == ColorEnum.YELLOW) {
                    return ColorEnum.GREEN;
                }
                break;

            case ColorEnum.WHITE:
                return color;
                break;
        }
        return ColorEnum.BLACK;
    }

    /// @function getColor
    /// Return the object of the enumeration corresponding to the string in argument, null if the string does not represent a color name
    /// @param {String} the color name
    function getColor(colorName) {
        for (var id in ColorEnum) {
            if (ColorEnum[id].name == colorName) {
                return ColorEnum[id];
            }
        }
        return null;
    }

    return {
        ColorEnum: ColorEnum,
        additiveColor: additiveColor,
        subFilterColor: subFilterColor,
        getColor: getColor
    }
});

