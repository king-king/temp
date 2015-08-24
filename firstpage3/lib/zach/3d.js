/**
 * 	author: Hu Jianqing [huhuh1234567@126.com]
 * 	c++ ver. date: Sept., 2012
 * 	js ver. date: Oct., 2013
 * 	intro: base on book 'real-time rendering'
 * 	license: open
 */

library( function () {

	var matrix = {};
	var geometry = {};

	function MatrixFromRows(vs){
		return [
			vs[0][0], vs[0][1], vs[0][2], vs[0][3],
			vs[1][0], vs[1][1], vs[1][2], vs[1][3],
			vs[2][0], vs[2][1], vs[2][2], vs[2][3],
			vs[3][0], vs[3][1], vs[3][2], vs[3][3]
		];
	}

	function MatrixFromColumns(vs){
		return [
			vs[0][0], vs[1][0], vs[2][0], vs[3][0],
			vs[0][1], vs[1][1], vs[2][1], vs[3][1],
			vs[0][2], vs[1][2], vs[2][2], vs[3][2],
			vs[0][3], vs[1][3], vs[2][3], vs[3][3]
		];
	}

	function VectorFromRow(m,i){
		var base = i*4;
		return [
			m[base],
			m[base+1],
			m[base+2],
			m[base+3]
		];
	}

	function VectorFromColumn(m,i){
		return [
			m[i],
			m[i+4],
			m[i+8],
			m[i+12]
		];
	}

	function dot(vl,vr){
		return vl[0]*vr[0]+vl[1]*vr[1]+vl[2]*vr[2]+vl[3]*vr[3];
	}

	function cross(vl,vr){
		return [
			vl[1]*vr[2]-vl[2]*vr[1],
			vl[2]*vr[0]-vl[0]*vr[2],
			vl[0]*vr[1]-vl[1]*vr[0],
			0.0
		];
	}

	function uniform(v){
		var length = 1/Math.sqrt(dot(v,v));
		return [
			v[0]*length,
			v[1]*length,
			v[2]*length,
			v[3]*length
		];
	}

	function transform(m,v){
		return [
			dot(VectorFromRow(m,0),v),
			dot(VectorFromRow(m,1),v),
			dot(VectorFromRow(m,2),v),
			dot(VectorFromRow(m,3),v)
		];
	}

	function combine(m,n){
		return MatrixFromColumns([
			transform(m,VectorFromColumn(n,0)),
			transform(m,VectorFromColumn(n,1)),
			transform(m,VectorFromColumn(n,2)),
			transform(m,VectorFromColumn(n,3))
		]);
	}

	function transpose(m){
		return [
			m[0], m[4], m[8], m[12],
			m[1], m[5], m[9], m[13],
			m[2], m[6], m[10], m[14],
			m[3], m[7], m[11], m[15]
		];
	}

	function inverse(m){
		var D_12_12 = m[5]*m[10]-m[6]*m[9];
		var D_12_02 = m[4]*m[10]-m[6]*m[8];
		var D_12_01 = m[4]*m[9]-m[5]*m[8];
		var D_02_12 = m[1]*m[10]-m[2]*m[9];
		var D_02_02 = m[0]*m[10]-m[2]*m[8];
		var D_02_01 = m[0]*m[9]-m[1]*m[8];
		var D_01_12 = m[1]*m[6]-m[2]*m[5];
		var D_01_02 = m[0]*m[6]-m[2]*m[4];
		var D_01_01 = m[0]*m[5]-m[1]*m[4];
		var D_12_23 = m[6]*m[11]-m[7]*m[10];
		var D_12_13 = m[5]*m[11]-m[7]*m[9];
		var D_12_03 = m[4]*m[11]-m[7]*m[8];
		var M = 1/(m[0]*D_12_12-m[1]*D_12_02+m[2]*D_12_01);
		var M12 = -m[1]*D_12_23+m[2]*D_12_13-m[3]*D_12_12;
		var M13 = m[0]*D_12_23-m[2]*D_12_03+m[3]*D_12_02;
		var M14 = -m[0]*D_12_13+m[1]*D_12_03-m[3]*D_12_01;
		return [
			 D_12_12*M,	-D_02_12*M,	 D_01_12*M,	M12*M,
			-D_12_02*M,	 D_02_02*M,	-D_01_02*M,	M13*M,
			 D_12_01*M,	-D_02_01*M,	 D_01_01*M,	M14*M,
			0,			0,			0,			1
		];
	}

	matrix.unit = function(){
		return [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
	};

	matrix.translate = function(x,y,z){
		return [
			1, 0, 0, x,
			0, 1, 0, y,
			0, 0, 1, z,
			0, 0, 0, 1
		];
	};

	matrix.scale = function(x, y, z) {
		return [
			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1
		];
	};

	matrix.rotateX = function(a) {
		var sa = Math.sin(a);
		var ca = Math.cos(a);
		return [
			1, 0, 0, 0,
			0, ca, -sa, 0,
			0, sa, ca, 0,
			0, 0, 0, 1
		];
	};

	matrix.rotateY = function(a) {
		var sa = Math.sin(a);
		var ca = Math.cos(a);
		return [
			ca, 0, sa, 0,
			0, 1, 0, 0,
			-sa, 0, ca, 0,
			0, 0, 0, 1
		];
	};

	matrix.rotateZ = function(a) {
		var sa = Math.sin(a);
		var ca = Math.cos(a);
		return [
			ca, -sa, 0, 0,
			sa, ca, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
	};

	matrix.rotateBase = function(ex, ey, ez) {
		return MatrixFromRows([
			ex,
			ey,
			ez,
			[0, 0, 0, 1]
		]);
	};

	matrix.lookAt = function(eye, center, top) {
		var ez = uniform([eye[0]-center[0], eye[1]-center[1], eye[2]-center[2], 0.0]);
		var ex = uniform(cross(top, ez));
		var ey = uniform(cross(ez, ex));
		return combine(matrix.rotateBase(ex, ey, ez), matrix.translate(-eye[0],-eye[1],-eye[2]));
	};

	matrix.perspectiveProject = function(w, h, n, f) {
		return [
			2.0*n/w, 0, 0, 0,
			0, 2.0*n/h, 0, 0,
			0, 0, -(f+n)/(f-n), -2.0*f*n/(f-n),
			0, 0, -1, 0
		];
	};

	/*
		      z
		      ^
		      |
		    .-|-.---0
		   /  |/   /|
		  .---3---. .
		 /   /   /|/|
		.---.---. 1------>x
		|   |   |/|/
		.---6---. .
		|   |   |/
		4---.---.
	 */
	geometry.crystal = function() {
		return {
			vertex: [
				//0523
				1.0, 1.0, 1.0,
				-1.0, 0.0, 0.0,
				0.0, 1.0, 0.0,
				0.0, 0.0, 1.0,
				//0631
				1.0, 1.0, 1.0,
				0.0, -1.0, 0.0,
				0.0, 0.0, 1.0,
				1.0, 0.0, 0.0,
				//0712
				1.0, 1.0, 1.0,
				0.0, 0.0, -1.0,
				1.0, 0.0, 0.0,
				0.0, 1.0, 0.0,
				//1467
				1.0, 0.0, 0.0,
				-1.0, -1.0, -1.0,
				0.0, -1.0, 0.0,
				0.0, 0.0, -1.0,
				//2475
				0.0, 1.0, 0.0,
				-1.0, -1.0, -1.0,
				0.0, 0.0, -1.0,
				-1.0, 0.0, 0.0,
				//3456
				0.0, 0.0, 1.0
				-1.0, -1.0, -1.0,
				-1.0, 0.0, 0.0,
				0.0, -1.0, 0.0,
			],
			index: [
				//023,532(+0)
				0, 2, 3,
				1, 3, 2,
				//031,613(+4)
				4, 6, 7,
				5, 7, 6,
				//012,721(+8)
				8, 10, 11,
				9, 11, 10,
				//167,476(+12)
				12, 14, 15,
				13, 15, 14,
				//275,457(+16)
				16, 18, 19,
				17, 19, 18,
				//356,465(+20)
				20, 22, 23,
				21, 23, 22
			],
			uv: [
				//0523
				0.5, 0.0,
				0.5, 1.0,
				0.0, 0.5,
				1.0, 0.5,
				//0631
				0.5, 0.0,
				0.5, 1.0,
				0.0, 0.5,
				1.0, 0.5,
				//0712
				0.5, 0.0,
				0.5, 1.0,
				0.0, 0.5,
				1.0, 0.5,
				//1467
				0.5, 0.0,
				0.5, 1.0,
				0.0, 0.5,
				1.0, 0.5,
				//2475
				0.5, 0.0,
				0.5, 1.0,
				0.0, 0.5,
				1.0, 0.5,
				//3456
				0.5, 0.0,
				0.5, 1.0,
				0.0, 0.5,
				1.0, 0.5,
			]
		};
	};

	/*
		  y
		  ^
		  |
		  2
		 / \
		0   1---->x
		 \ /
		  3
	 */
	geometry.diamond = function(){
		return {
			vertex: [
				-1.0, 0.0, 0.0,
				1.0, 0.0, 0.0,
				0.0, 1.73, 0.0,
				0.0, -1.73, 0.0
			],
			index: [
				2, 0, 1,
				1, 0, 3
			],
			uv: [
				0.0, 0.5,
				1.0, 0.5,
				0.5, 0.0,
				0.5, 1.0
			]
		};
	};

	/*
		    y
		    ^
		    |
		0---.---1
		|   |   |
		.---.---.---->x
		|   |   |
		2---.---3
	 */
	geometry.square = function(){
		return {
			vertex: [
				-1.0, 1.0, 0.0,
				1.0, 1.0, 0.0,
				-1.0, -1.0, 0.0,
				1.0, -1.0, 0.0
			],
			index: [
				0, 2, 1,
				1, 2, 3
			],
			uv: [
				0.0, 0.0,
				1.0, 0.0,
				0.0, 1.0,
				1.0, 1.0
			]
		}
	};

	exports.MatrixFromRows = MatrixFromRows;
	exports.MatrixFromColumns = MatrixFromColumns;
	exports.VectorFromRow = VectorFromRow;
	exports.VectorFromColumn = VectorFromColumn;

	exports.dot = dot;
	exports.cross = cross;
	exports.uniform = uniform;
	exports.transform = transform;
	exports.combine = combine;
	exports.transpose = transpose;
	exports.inverse = inverse;

	exports.matrix = matrix;
	exports.geometry = geometry;

});