import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String, required: true, unique: true},
});

export default mongoose.model('Cart', cartSchema);

