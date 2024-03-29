const conn = require("./conn");
const User = require("./User");
const Friendship = require("./Friendship");
const Attending = require("./Attending");
const Comment = require("./Comment");
const Post = require("./Post");
const path = require("path");
const fs = require("fs");

User.belongsToMany(User, {
  as: "Requester",
  through: Friendship,
  foreignKey: "requesterId",
});
User.belongsToMany(User, {
  as: "Accepter",
  through: Friendship,
  foreignKey: "accepterId",
});

User.hasMany(Friendship, {
  foreignKey: "requesterId",
  onDelete: "CASCADE",
});
User.hasMany(Friendship, { foreignKey: "accepterId", onDelete: "CASCADE" });
User.hasMany(Attending, { onDelete: "CASCADE" });
Attending.belongsTo(User);
User.hasMany(Comment, { foreignKey: "userId", onDelete: "CASCADE" });
Comment.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Post, { foreignKey: "userId", onDelete: "CASCADE" });
Post.belongsTo(User, { foreignKey: "userId" });

const getImage = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "base64", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const syncAndSeed = async () => {
  await conn.sync({ force: true });

  // const avatar = await getImage(
  //   path.join(__dirname, "../../static/DUET/Moe_Szyslak.png")
  // );

  const [moe, lucy, larry, ethyl, hannah, anisah, alex, justin] =
    await Promise.all([
      User.create({
        username: "moe",
        password: "123",
        firstName: "Moe",
        lastName: "Money",
        bio: "Hi! My name is Moe! My favorite genres of music are bubble gum pop and hardcore rap.",
        img: await getImage(
          path.join(__dirname, `../../static/DUET/moe-howard-1.jpg`)
        ),
      }),
      User.create({
        username: "lucy",
        password: "123",
        firstName: "Lucy",
        lastName: "Goosey",
        address: "Old Town Road",
        bio: "I love musicals!! I'm a former performer and singer.",
        img: await getImage(path.join(__dirname, `../../static/DUET/lucy.jpg`)),
      }),
      User.create({
        username: "larry",
        password: "123",
        firstName: "Larry",
        lastName: "Mariah-Carey",
        bio: "Deadhead. Rock and roll.",
        img: await getImage(
          path.join(__dirname, `../../static/DUET/Larry.jpg`)
        ),
      }),
      User.create({
        username: "ethyl",
        password: "123",
        firstName: "Ethyl",
        lastName: "Bobethyl",
        bio: "Hello! I'm Ethyl. I just moved back to NYC and am looking for other sports fans. GO KNICKS!!!",
        img: await getImage(path.join(__dirname, `../../static/DUET/th.jpg`)),
      }),
      User.create({
        username: "hannah",
        password: "123",
        firstName: "Hannah",
        lastName: "Rademaker",
        bio: "Hi! My name is hannah! I love going to concerts and hanging out with friends!",
        img: await getImage(
          path.join(__dirname, `../../static/DUET/hannahavatar.png`)
        ),
        // img: "../static/DUET/hannahavatar.png",
      }),
      User.create({
        username: "anisah",
        password: "123",
        firstName: "Anisah",
        lastName: "M",
        bio: "Hi! My name is anisah! I love going to concerts and hanging out with friends!",
        img: await getImage(
          path.join(__dirname, `../../static/DUET/anisahavatar.png`)
        ),
        // img: "../static/DUET/anisahavatar.png",
      }),
      User.create({
        username: "alex",
        password: "123",
        firstName: "Alex",
        lastName: "A",
        bio: "Hi! My name is alex! I love going to concerts and hanging out with friends!",
        img: await getImage(
          path.join(__dirname, `../../static/DUET/alexavatar.png`)
        ),

        // img: "../static/DUET/alexavatar.png",
      }),
      User.create({
        username: "justin",
        password: "123",
        firstName: "Justin",
        lastName: "M",
        bio: "Hi! My name is justin! I love going to concerts and hanging out with friends!",
        img: await getImage(
          path.join(__dirname, `../../static/DUET/justinavatar.jpg`)
        ),
        // img: "../static/DUET/justinavatar.png",
      }),
    ]);

  const [fs1, fs2, fs3, fs4] = await Promise.all([
    conn.models.friendship.create({
      requesterId: moe.id,
      accepterId: lucy.id,
      status: "accepted",
    }),
    conn.models.friendship.create({
      requesterId: lucy.id,
      accepterId: ethyl.id,
      status: "accepted",
    }),
    conn.models.friendship.create({
      requesterId: larry.id,
      accepterId: ethyl.id,
      status: "accepted",
    }),
    Friendship.create({
      requesterId: lucy.id,
      accepterId: larry.id,
      status: "pending",
    }),
  ]);

  const [post1, post2, post3] = await Promise.all([
    Post.create({
      userId: justin.id,
      caption: "Looking for a friend to walk dogs with!",
      createdAt: "2021-06-01",
      body: "I love to hike and looking for a friend to walk our dogs with! My dog is super friendly and we love to go upsate",
      img: "https://media.istockphoto.com/id/1143749718/photo/concept-of-healthy-lifestyle-with-dog-and-man-hiking-outdoor.jpg?s=612x612&w=0&k=20&c=ox7p2XYECBnABDoDw2g832CIAeHgD7Bqaj7fmP_BOb4=",
    }),
    Post.create({
      userId: alex.id,
      caption: "Im new to tennis and I need a friend to play with!",
      createdAt: "2021-06-01",
      body: "I love tennis and I love playing. I'm looking for a friend to play tennis with!",
      img: "../static/DUET/tennis.jpg",
    }),
    Post.create({
      userId: hannah.id,
      caption: "Learning to cook instead of ordering takeout!",
      createdAt: "2021-06-01",
      body: "Does anyone want to take a cooking class with me? I am tyring to learn to cook and would love to find people in NYC to cook with!",
    }),
  ]);

  const [comment1, comment2, comment3, comment4, comment5] = await Promise.all([
    Comment.create({
      userId: moe.id,
      caption: "I love the Nets! Who wants to hang out and watch the game?",
      eventId: "Z7r9jZ1Ad4s-N",
    }),
    Comment.create({
      userId: lucy.id,
      caption: "I really want to go to this event! who wants to join?",
      eventId: "Z7r9jZ1Ad4s-N",
    }),
    Comment.create({
      userId: ethyl.id,
      caption: "@lucy I would love to go to this event! Lets chat :)",
      eventId: "Z7r9jZ1Ad4s-N",
    }),
    Comment.create({
      userId: larry.id,
      caption:
        "Hey guys, I'm going to this event! None of my friends like Shinia Twain, who wants to join me?",
      eventId: "G5diZ94NPjotW",
    }),
    Comment.create({
      userId: alex.id,
      caption:
        "@larry I would love to go to this event with you! I love Shinia Twain!",
      eventId: "G5diZ94NPjotW",
    }),
    Comment.create({
      userId: moe.id,
      caption: "Justin I have a dog! Lets walk them together!",
      postId: post1.id,
    }),
  ]);

  const [test1, test2, test3, test4] = await Promise.all([
    Attending.create({
      userId: moe.id,
      isAttending: true,
      eventId: "Z7r9jZ1Ad4s-N",
    }),
    Attending.create({
      userId: lucy.id,
      isAttending: true,
      eventId: "Z7r9jZ1Ad4s-N",
    }),
    Attending.create({
      userId: hannah.id,
      isAttending: true,
      eventId: "Z7r9jZ1Ad4s-N",
    }),
    Attending.create({
      userId: anisah.id,
      isAttending: true,
      eventId: "G5diZ94NPjotW",
    }),
  ]);

  //console.log(test1);
  // console.log(test2);
  // console.log(fs1);
  // console.log(lucy.findThisUser());
  //console.log(lucy.findMyFriendships());

  // const test = () => {
  //   let friend;
  //   if (lucy.id === friendship.requesterId) {
  //     friend = friendship.accepterId;
  //   } else {
  //     friend = friendship.requesterId;
  //   }
  //   return friend;
  // };

  // console.log(test(lucy));
  //console.log(User_Friendships)
  return {
    users: {
      moe,
      lucy,
      larry,
      ethyl,
      hannah,
      anisah,
      alex,
      justin,
    },
    friendships: {
      fs1,
      fs2,
      fs3,
      fs4,
    },
    comments: {
      comment1,
      comment2,
      comment3,
      comment4,
    },
    attendings: {
      test1,
      test2,
      test3,
      test4,
    },
    posts: {
      post1,
      post2,
      post3,
    },
  };
};

module.exports = {
  syncAndSeed,
  User,
  Friendship,
  Comment,
  Attending,
  Post,
};
