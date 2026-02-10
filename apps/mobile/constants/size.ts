import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) => size + (horizontalScale(size) - size) * factor;

// Viewport height and width helpers (similar to CSS vh/vw units)
const vh = (percentage: number,) => (percentage / 100) * height;
const vw = (percentage: number,) => (percentage / 100) * width;

export { horizontalScale as hs, moderateScale as ms, vh, verticalScale as vs, vw };




export const Sizes = {
    fontSize: {
        xxl: moderateScale(34),
        xl: moderateScale(22),
        lg: moderateScale(18),
        md: moderateScale(16),
        sm: moderateScale(14),
        xs: moderateScale(12),
        xxs: moderateScale(10),
    },
    lineHeight: {
        xxl: moderateScale(40),
        xl: moderateScale(28),
        lg: moderateScale(24),
        md: moderateScale(24),
        sm: moderateScale(20),
        xs: moderateScale(16),
        xxs: moderateScale(12),
    },
    screenPaddingHorizontal: {
        sm: horizontalScale(16),
        md: horizontalScale(24),
        lg: horizontalScale(32),
        xl: horizontalScale(40),
        xxl: horizontalScale(48),
    },
    screenPaddingVertical: {
        sm: verticalScale(16),
        md: verticalScale(24),
        lg: verticalScale(32),
        xl: verticalScale(40),
        xxl: verticalScale(48),
    },
    screenPadding: {
        sm: horizontalScale(16),
        md: horizontalScale(24),
        lg: horizontalScale(32),
        xl: horizontalScale(40),
        xxl: horizontalScale(48),
    },
    borderRadius: {
        sm: moderateScale(4),
        md: moderateScale(8),
        lg: moderateScale(12),
        xl: moderateScale(16),
        xxl: moderateScale(20),
    },

}