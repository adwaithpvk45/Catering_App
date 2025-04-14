import Service from "../models/serviceModel" 
export const addService = async(req,res) =>{
    try {
        const {name,description,price,category,duration,} = req.body
        const {serviceImage} = req.file
        const vendorId = req.user._id
        if(!name||!description||!price||!category){
            return res.status(400).json({message:"Please fill all the details of the Service"})
        }
        if(!serviceImage){
            return res.status(400).json({message:"Service image not included."})
        }
        const newService = new Service({
            name,
            description,
            price,
            category,
            foodImage, 
            duration,
            vendor:vendorId, 
        })

        const serviceAdded = await newService.save()
        
        return res.status(200).json({message:"New Item added",serviceAdded})
    } catch (error) {
        res.status(200).json({message:error.message})
    }
}

export const getAllService = async(req,res) =>{
    try {
        //   const vendorId = req.user._id
          const services = await Service.find()
          res.status(200).json({message:"All Service fetched",services})
    } catch (error) {
        res.status(400).json({message:error.message})     
    }
}

export const getVendorService = async (req,res) => {
    try {
        const {vendorId} = req.params
        const vendorService = await Service.find({vendorId:vendorId})
        res.status(200).json({message:"Fetched all data",vendorService})
    } catch (error) {
        res.status(400).json({message:"Error in getting vendorFood",error})
    }
}