import Item from "../model/itemModel.js";

// 1. Create: Report a new item
export const create = async (req, res) => {
    try {
        const itemData = new Item(req.body);
        const savedItem = await itemData.save();
        res.status(200).json(savedItem);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// 2. Read: Fetch all reported items
export const fetch = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// 3. Update: Modify item details by ID
export const update = async (req, res) => {
    try {
        const id = req.params.id;
        const itemExist = await Item.findOne({ _id: id });
        if (!itemExist) {
            return res.status(404).json({ message: "Item not found." });
        }
        const updatedItem = await Item.findByIdAndUpdate(id, req.body, { new: true });
        res.status(201).json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

// 4. Delete: Remove an item record by ID
export const deleteItem = async (req, res) => {
    try {
        const id = req.params.id;
        const itemExist = await Item.findOne({ _id: id });
        if (!itemExist) {
            return res.status(404).json({ message: "Item not found." });
        }
        await Item.findByIdAndDelete(id);
        res.status(201).json({ message: "Item deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};