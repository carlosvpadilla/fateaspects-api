import mongoose from 'mongoose';

const AspectSchema: mongoose.Schema = new mongoose.Schema({
    name: String
});

const GameSchema: mongoose.Schema = new mongoose.Schema({
    name: String,
    aspects: { type: [AspectSchema], default: []}
});

export default mongoose.model("Game", GameSchema);