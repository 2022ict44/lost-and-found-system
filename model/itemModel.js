import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: true,
     },
    description: { 
        type: String,
         required: true,
    },
    category: { 
        type: String,
        required: true,
    }, 
    status: { 
        type: String,
        required: true,
    },  
    location: { 
        type: String, 
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.model("items", itemSchema); 