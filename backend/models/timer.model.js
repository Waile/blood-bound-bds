import mongoose from 'mongoose';

const timerSchema = mongoose.Schema({
    date: {type: Date, required: true}, //when to execute
    type: {type: String, required: true}, //which collection this timer object operates on
    updates: {type: Object, default: {}} //updates to be performed, if given.
    //the _id will be that of the corresponding document for ease of use.
})

const Timer = mongoose.model('Timer', timerSchema);

export default Timer;