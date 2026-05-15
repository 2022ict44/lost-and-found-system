import Item from "../model/itemModel.js";

export const create = async (req, res) => {
    try {
        const itemData = new Item(req.body);
        const savedItem = await itemData.save();
        res.status(200).json(savedItem);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
};

