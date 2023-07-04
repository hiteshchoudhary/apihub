import { faker } from "@faker-js/faker";
import { User } from "../models/apps/auth/user.models.js";
import { SocialBookmark } from "../models/apps/social-media/bookmark.models.js";
import { SocialComment } from "../models/apps/social-media/comment.models.js";
import { SocialFollow } from "../models/apps/social-media/follow.models.js";
import { SocialLike } from "../models/apps/social-media/like.models.js";
import { SocialPost } from "../models/apps/social-media/post.models.js";
import { SocialProfile } from "../models/apps/social-media/profile.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getRandomNumber } from "../utils/helpers.js";
import {
  SOCIAL_BOOKMARKS_COUNT,
  SOCIAL_COMMENTS_COUNT,
  SOCIAL_FOLLOWS_COUNT,
  SOCIAL_LIKES_COUNT,
  SOCIAL_POSTS_COUNT,
  SOCIAL_POST_IMAGES_COUNT,
} from "./_constants.js";

// generate random posts
const posts = new Array(SOCIAL_POSTS_COUNT).fill("_").map(() => {
  return {
    content: faker.lorem.lines({ min: 2, max: 5 }),
    tags: faker.lorem.words({ min: 3, max: 8 }).split(" "),
    images: new Array(SOCIAL_POST_IMAGES_COUNT).fill("_").map(() => {
      return {
        url: faker.image.urlLoremFlickr({
          category: "food",
        }),
        localPath: "",
      };
    }),
  };
});

// generate random comments
const comments = new Array(SOCIAL_COMMENTS_COUNT).fill("_").map(() => {
  return {
    content: faker.lorem.lines({
      min: 1,
      max: 10,
    }),
  };
});

const seedSocialProfiles = async () => {
  const profiles = await SocialProfile.find(); // Social profile is being created while user is created
  const profileUpdatePromise = profiles.map(async (profile) => {
    await SocialProfile.findByIdAndUpdate(profile._id, {
      // find profile and insert random data there
      $set: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        bio: faker.person.bio(),
        dob: faker.date.past({
          years: 18,
        }),
        location: `${faker.location.city()}, ${faker.location.country()}`,
        countryCode: "+91",
        phoneNumber: faker.phone.number("9#########"),
      },
    });
  });
  await Promise.all(profileUpdatePromise); // resolve all promises
};

const seedSocialPosts = async () => {
  await SocialPost.deleteMany({});
  const users = await User.find();
  await SocialPost.insertMany(
    posts.map((post, i) => {
      return {
        ...post,
        author: users[i] ?? users[getRandomNumber(users.length)], // set post to every user and then set random user as an author
      };
    })
  );
};

const seedSocialComments = async () => {
  await SocialComment.deleteMany({});
  const authors = await User.find();
  const posts = await SocialPost.find();
  await SocialComment.insertMany(
    comments.map((comment) => {
      return {
        ...comment,
        author: authors[getRandomNumber(authors.length)],
        postId: posts[getRandomNumber(posts.length)],
      };
    })
  );
};

const seedSocialLikes = async () => {
  await SocialLike.deleteMany({});
  const users = await User.find();
  const posts = await SocialPost.find();
  const comments = await SocialComment.find();
  // Post likes documents
  const socialPostsLikesPromise = new Array(SOCIAL_LIKES_COUNT)
    .fill("_")
    .map(async () => {
      const likedBy = users[getRandomNumber(users.length)];
      const post = posts[getRandomNumber(posts.length)];

      await SocialLike.findOneAndUpdate(
        {
          postId: post._id,
          likedBy: likedBy._id,
        },
        {
          $set: {
            postId: post._id,
            likedBy: likedBy._id,
          },
        },
        { upsert: true } // We don't want duplicate entries of the like. So if found then update else insert
      );
    });

  // Comment likes documents
  const socialCommentsLikesPromise = new Array(SOCIAL_LIKES_COUNT)
    .fill("_")
    .map(async () => {
      const likedBy = users[getRandomNumber(users.length)];
      const comment = comments[getRandomNumber(comments.length)];

      await SocialLike.findOneAndUpdate(
        {
          commentId: comment._id,
          likedBy: likedBy._id,
        },
        {
          $set: {
            commentId: comment._id,
            likedBy: likedBy._id,
          },
        },
        { upsert: true } // We don't want duplicate entries of the like. So if found then update else insert
      );
    });
  await Promise.all([
    ...socialPostsLikesPromise,
    ...socialCommentsLikesPromise,
  ]);
};

const seedSocialFollowers = async () => {
  await SocialFollow.deleteMany({});
  const users = await User.find();
  const socialFollowerPromise = new Array(SOCIAL_FOLLOWS_COUNT)
    .fill("_")
    .map(async () => {
      let followerIndex = getRandomNumber(users.length); // generate a random index for the follower
      let followeeIndex = getRandomNumber(users.length); // generate a random index for the followee
      if (followeeIndex === followerIndex) {
        // This shows that both follower and followee are the same
        followerIndex <= 0 ? followerIndex++ : followerIndex--; // avoid same follower and followee
      }
      const follower = users[followerIndex]; // get the follower
      const followee = users[followeeIndex]; // get the followee

      await SocialFollow.findOneAndUpdate(
        {
          followerId: follower._id,
          followeeId: followee._id,
        },
        {
          $set: {
            followerId: follower._id,
            followeeId: followee._id,
          },
        },
        { upsert: true } // We don't want duplicate entries of the follows. So if found then update else insert
      );
    });
  await Promise.all(socialFollowerPromise);
};

const seedSocialBookmarks = async () => {
  await SocialBookmark.deleteMany({});
  const users = await User.find();
  const posts = await SocialPost.find();
  const socialPostsBookmarksPromise = new Array(SOCIAL_BOOKMARKS_COUNT)
    .fill("_")
    .map(async () => {
      const bookmarkedBy = users[getRandomNumber(users.length)];
      const post = posts[getRandomNumber(posts.length)];

      await SocialBookmark.findOneAndUpdate(
        {
          postId: post._id,
          bookmarkedBy: bookmarkedBy._id,
        },
        {
          $set: {
            postId: post._id,
            bookmarkedBy: bookmarkedBy._id,
          },
        },
        { upsert: true } // We don't want duplicate entries of the bookmarks. So if found then update else insert
      );
    });

  await Promise.all(socialPostsBookmarksPromise);
};

const seedSocialMedia = asyncHandler(async (req, res) => {
  await seedSocialProfiles();
  await seedSocialPosts();
  await seedSocialComments();
  await seedSocialLikes();
  await seedSocialFollowers();
  await seedSocialBookmarks();
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        {},
        "Database populated for social media successfully"
      )
    );
});

export { seedSocialMedia };
