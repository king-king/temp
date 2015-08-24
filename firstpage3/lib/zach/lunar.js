/**
 * Created by 白 on 2015/2/16.
 * 计算农历
 * 非原创,修改http://www.cnitblog.com/addone/archive/2009/12/30/63461.html的代码
 */

library( function () {
	var lunarInfo = [
		0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, // 1900
		0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, // 1905
		0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, // 1910
		0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, // 1915
		0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, // 1920
		0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, // 1925
		0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, // 1930
		0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, // 1935
		0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, // 1940
		0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, // 1945
		0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, // 1950
		0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0, // 1955
		0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, // 1960
		0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, // 1965
		0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, // 1970
		0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6, // 1975
		0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, // 1980
		0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, // 1985
		0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, // 1990
		0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, // 1995
		0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, // 2000
		0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, // 2005
		0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, // 2010
		0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, // 2015
		0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, // 2020
		0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, // 2025
		0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, // 2030
		0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, // 2035
		0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, // 2040
		0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0  // 2045
	];

	// 计算y年那个月是闰月(1-12),若没有闰月,返回0
	function getLeapMonth( y ) {
		return lunarInfo[y - 1900] & 0xf;
	}

	// 计算y年闰月的天数
	function getLeapDays( y ) {
		return getLeapMonth( y ) ? ( lunarInfo[y - 1900] & 0x10000 ) ? 30 : 29 : 0;
	}

	// 计算y年的总天数
	function getYearDays( y ) {
		var i, sum = 348;
		for ( i = 0x8000; i > 0x8; i >>= 1 ) {
			sum += ( lunarInfo[y - 1900] & i ) ? 1 : 0;
		}
		return sum + getLeapDays( y );
	}

	// 计算y年m月的天数
	function getMonthDays( y, m ) {
		return ( lunarInfo[y - 1900] & ( 0x10000 >> m ) ) ? 30 : 29;
	}

	// 传入date,计算农历
	function Lunar( date ) {
		var day = ( date - new Date( 1900, 0, 31 ) ) / 8640000, // 1900年1月31日是正月初一
			year, yearDays, month, monthDays, inLeap, isLeap, lMonth;

		// 计算年
		for ( year = 1900; ; ++year ) {
			yearDays = getYearDays( year );
			if ( yearDays - day < 0 ) {
				break;
			}
			else {
				day -= yearDays;
			}
		}

		lMonth = getLeapMonth( year ); //閏哪個月

		for ( month = 1; ; ++month ) {
			inLeap = lMonth > 0 && month === ( lMonth + 1 );
			monthDays = inLeap ? getLeapDays( year ) : getMonthDays( year, month );

			if ( day - monthDays < 0 ) {
				day -= monthDays;
				isLeap = inLeap;
				break;
			}
		}

		return {
			year : year,
			month : day,
			day : day + 1,
			isLeap : isLeap
		};
	}

	module.exports = Lunar;
} );