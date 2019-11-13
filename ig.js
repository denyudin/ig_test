const rp = require('request-promise');
const ua = require('user-agents');

const { IG_TEST_DOMAIN, IG_TEST_PARSE_REGEX } = require('./constants');
const { proxyUrl, userAgent, lastPostsCount } = require('./config');

const request = ({ uri, method='GET' }) => rp({
    uri,
    method,
    proxy: proxyUrl,
    headers: {
        'User-Agent': userAgent || (new ua()).toString()
    },
});

module.exports = {
    getProfile: async (profileName) => {
        const uri = `${IG_TEST_DOMAIN}${profileName.trim()}/`;
        const response = await request({ uri });
        const result = IG_TEST_PARSE_REGEX.exec(response);
        let data;

        try {
            const profile = JSON.parse(result[1]).entry_data.ProfilePage[0].graphql.user;
            const lastPosts = profile.edge_owner_to_timeline_media.edges
                .slice(0, lastPostsCount)
                .map(({ node: { id, thumbnail_src } }) => ({ id, thumbnail_src }));

            data = {
                name: profile.full_name,
                description: profile.biography,
                followersCount: profile.edge_followed_by.count,
                followingCount: profile.edge_follow.count,
                lastPosts
            };
        } catch (e) {
            data = null
        }

        return data;
    }
};
