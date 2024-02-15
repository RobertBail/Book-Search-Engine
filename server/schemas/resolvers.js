const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
      me: async (parent, args, context) => {
        if (context.user) {
          const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
          return userData;
        }
        throw AuthenticationError;
      },
    },
  
    Mutation: {
      addUser: async (parent, {username, email, password}) => {
        const user = await User.create({username, email, password});
        const token = signToken(user);
        return { token, user };
      },
      login: async (parent, { email, password }) => {
         const user = await User.findOne({ email });
      
         if (!user) {
          throw AuthenticationError;
          }
      
         const correctPW = await user.isCorrectPassword(password);
      
         if (!correctPW) {
         throw AuthenticationError;
            }
      
         const token = signToken(user);
      
         return { token, user };
         },   
      
      saveBook: async (parent, { newBook}, context) => {
        if (context.user) {
          const updatedUser = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: newBook }},
            { new: true }
          );
          return updatedUser;
        }
        throw new AuthenticationError('You need to be logged in!');
      },
      deleteBook: async (parent, { bookId }, context) => {
        if (context.user) {
          const updatedUser = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId }}},
            { new: true }
          );
          return updatedUser;
        }
        throw new AuthenticationError('You need to be logged in!');
      },
    },
  };
  
  module.exports = resolvers;