const { Schema, model } = require('mongoose');
const reaction = require('./reaction');
const moment = require('moment');
const thoughtSchema = new Schema(
    {
      thoughtText: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 300,
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      username: {
        type: String,
        required: true
      },
      reactions: [reaction],
    },
    {
      toJSON: {
        getters: true,
        virtuals: true
      },
      id: false
    }
  );



thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
})

const Thought = model('thoughts', thoughtSchema);

module.exports = Thought;