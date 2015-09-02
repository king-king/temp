var binaryTreePaths = function ( root ) {
    var path = [];
    var result = [];

    function toString( arr ) {
        return arr.join( "->" );
    }

    function visit( p ) {
        if ( p ) {
            path.push( p.val );
            if ( !p.left && !p.right ) {
                result.push( toString( path ) );
                return;
            }
            visit( p.left );
            p.left && path.pop();
            visit( p.right );
            p.right && path.pop();
            return p;
        }
    }

    visit( root );
    return result;
};