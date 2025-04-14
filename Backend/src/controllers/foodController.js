import Food from '../models/foodModel'
export const addFood = async(req,res) =>{
    try {
        const {name,description,price,category} = req.body
        const {foodImage} = req.file
        const vendorId = req.user._id
        if(!name||!description||!price||!category){
            return res.status(400).json({message:"Please fill all the details of the food item"})
        }
        if(!foodImage){
            return res.status(400).json({message:"Food image not included."})
        }
        const newFood = new Food({
            name,
            description,
            price,
            category,
            foodImage, 
            vendor:vendorId, 
        })

        const foodadded = await newFood.save()
        
        return res.status(200).json({message:"New Item added",foodadded})
    } catch (error) {
        res.status(200).json({message:error.message})
    }
}

export const getAllFood = async(req,res) =>{
    try {
        //   const vendorId = req.user._id
          const foods = await Food.find()
          res.status(200).json({message:"All food fetched",foods})
    } catch (error) {
        res.status(400).json({message:error.message})     
    }
}

export const getVendorFood= async (req,res) => {
    try {
        const {vendorId} = req.params
        const vendorFood = await Food.find({vendorId:vendorId})
        res.status(200).json({message:"Fetched all data",vendorFood})
    } catch (error) {
        res.status(400).json({message:"Error in getting vendorFood",error})
        
    }
}


