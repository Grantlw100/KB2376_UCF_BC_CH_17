const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (_, { userId, username }, context) => {
        console.log('Attempting to retrieve user information', { userId, username });
      
        if (!context.user) {
          console.error('Not Authenticated: No user in context');
          throw new Error('Not Authenticated');
        }
      
        console.log('User is authenticated', { user: context.user });
      
        const searchCriteria = username ? { username } : { _id: userId || context.user._id };
        console.log('Search criteria for finding user:', searchCriteria);
      
        const foundUser = await User.findOne(searchCriteria);
      
        if (!foundUser) {
          console.error('Cannot find a user with this id or username', searchCriteria);
          throw new Error('Cannot find a user with this id or username');
        }
      
        console.log('User found:', foundUser);
        return foundUser;
      },
    },
  Mutation: {
    createUser: async (_, { username, email, password }) => {
        console.log("Attempting to create user", { username, email });
        try {
          const user = await User.create({ username, email, password });
          console.log("User created", user);
          const token = signToken(user);
          console.log("Token generated", token);
          return { token, user };
        } catch (error) {
          console.error("Error creating user:", error);
          // Explicitly return null for clarity, though this is the default behavior when not returning anything.
          return null;
        }
      },            
    login: async (_, { username, email, password }) => {
      const user = await User.findOne({
        $or: [{ username: username }, { email: email }],
      });

      if (!user) {
        throw new Error("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new Error('Wrong password');
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (_, { bookData }, context) => {
      if (!context.user) {
        throw new Error('Not Authenticated');
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $addToSet: { savedBooks: bookData } },
        { new: true, runValidators: true }
      );

      return updatedUser;
    },
    deleteBook: async (_, { bookId }, context) => {
      if (!context.user) {
        throw new Error('Not Authenticated');
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      );

      return updatedUser;
    },
  },
};


module.exports = resolvers;