(function (factory) {

    var zhv = factory(window.$);

    // 1. 自动关注所有大V
    zhv.autoFollowBigVers();

    // 2. 手动处理，自行判断大V
    /*
     zhv.getAllFolloweesOfCurrentUser(function (userList) {
     // user 数据结构参考下面的说明 <UserObject 用户信息数据结构>
     zhv.followUsers(userList.filter(function (user) {
     return user.agreeCount > 1000
     }))
     })
     */

    /*
     * UserObject 用户信息数据结构
     *
     * - {string} id: hash_id
     * - {string} name: 该用户名称
     * - {boolean} hasFollowed: 该用户是否已被你关注
     * - {number} followerCount: 该用户的关注者数目
     * - {number} askCount: 该用户的提问数
     * - {number} answerCount: 该用户的答题数目
     * - {number} agreeCount: 该用户获得的赞同数
     */

})(function ($) {

    var zh_xsrf = $('input[name="_xsrf"]').val();
    var zh_followee_collection = [];
    var exports = {};

    // 入口
    exports.autoFollowBigVers = function () {
        getAllFolloweesOfCurrentUser(function (userList) {
            followUsers(userList.filter(isNotFollowedBigVer))
        })
    };
    exports.getAllFolloweesOfCurrentUser = getAllFolloweesOfCurrentUser;
    exports.followUsers = followUsers;

    /*
     * @param {function} [done] - 执行完毕后调用的回调函数，callback({UserObject[]})
     */
    function getAllFolloweesOfCurrentUser(done) {
        var currentUser = getCurrentUserInfo();
        var hash_id = currentUser.id;
        var followeeCount = currentUser.followeeCount;

        // 清空已缓存的用户
        zh_followee_collection.length = 0;

        var i = 0;
        var loadCount = Math.ceil(followeeCount / 20);
        var timer = setInterval(function () {
            if (i < loadCount) {
                getFolloweeList(hash_id, 20 * i).done(function (data) {
                    if (data.r === 0) {
                        data.msg.forEach(function (item) {
                            var user = parseUserInfoFromHTML(item);
                            zh_followee_collection.push(user);
                        })
                    }
                });
                console.log(i + '/' + loadCount + ' ' + ((i * 100 / loadCount).toFixed(2) + '%'))
                i++
            } else {
                clearInterval(timer);
                console.log('加载当前用户所有关注的人，完毕');
                if (typeof done === 'function') {
                    done(zh_followee_collection)
                }
            }
        }, 200);
        console.log('尝试加载当前用户所有关注的人，共' + followeeCount + '人')
    }

    function parseUserInfoFromHTML(html) {
        var $el = $(html);
        var $btnFollow = $el.find('.zm-rich-follow-btn');
        var hash_id = $btnFollow.attr('data-id');
        var hasFollowed = $btnFollow.hasClass('zg-btn-unfollow');
        var userName = $el.find('.zm-item-link-avatar').attr('title');

        var $links = $el.find('.details').find('a');
        var followerCount = parseInt($links.eq(0).text(), 10);
        var askCount = parseInt($links.eq(1).text(), 10);
        var answerCount = parseInt($links.eq(2).text(), 10);
        var agreeCount = parseInt($links.eq(3).text(), 10);

        return {
            id: hash_id,
            name: userName,
            hasFollowed: hasFollowed,
            followerCount: followerCount,
            askCount: askCount,
            answerCount: answerCount,
            agreeCount: agreeCount
        }
    }

    function isNotFollowedBigVer(user) {
        if (user.hasFollowed) {
            return false
        } else {
            // 各种主观的评价大V的标准
            return (user.agreeCount > 1000 && user.followerCount > 500) || (user.agreeCount > 100 && user.followerCount > 2000);
        }
    }

    /*
     * @param {UserObject[]} userList
     */
    function followUsers(userList) {
        var total = userList.length;
        if (total > 0) {
            console.log('关注' + total + '个用户，开始....');
            userList.forEach(function (user, i) {
                setTimeout(function () {
                    console.log(
                        (i + 1) + '/' + total + ' ' +
                        user.name + ' ' +
                        user.agreeCount + '赞同 ' +
                        user.followerCount + '关注'
                    );
                    followUser(user.id);
                    user.hasFollowed = true;
                    if (i + 1 === total) {
                        console.log('结束');
                    }
                }, i * 200)
            })
        } else {
            console.log('没有要关注的用户')
        }
    }

    /*
     * @return {UserObject} 当前用户信息
     */
    function getCurrentUserInfo() {
        var $btnFollow = $('.zm-profile-header-op-btns').find('.zm-rich-follow-btn');
        var $followNums = $('.zm-profile-side-following').find('strong');
        var $userNums = $('.profile-navbar').find('.num');
        return {
            // 用户的关注按钮上有该用户对应的 hash_id
            id: $btnFollow.attr('data-id'),
            name: $('.title-section').find('.name').text(),
            // TA关注的人数
            followeeCount: parseInt($followNums.eq(0).text(), 10),
            // 关注TA的人数
            followerCount: parseInt($followNums.eq(1).text(), 10),
            answerCount: parseInt($userNums.eq(1).text(), 10),
            agreeCount: parseInt($('.zm-profile-header-user-agree').find('strong').text(), 10)
        }
    }

    function getFolloweeList(hash_id, offset) {
        return $.ajax({
            type: 'POST',
            url: '/node/ProfileFolloweesListV2',
            data: {
                method: 'next',
                params: JSON.stringify({
                    "offset": offset,
                    "order_by": "created",
                    "hash_id": hash_id
                }),
                _xsrf: zh_xsrf
            },
            dataType: 'json'
        })
    }

    function followUser(hash_id) {
        return $.ajax({
            type: 'POST',
            url: '/node/MemberFollowBaseV2',
            data: {
                method: 'follow_member',
                params: JSON.stringify({"hash_id": hash_id}),
                _xsrf: zh_xsrf
            },
            dataType: 'JSON'
        })
    }

    return exports
});
