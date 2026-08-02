import Service from "../models/serviceModel.js";
export const addService = async (req, res) => {
  try {
    const { name, description, price, category, duration } = req.body;
    // const {serviceImage} = req.file
    const vendorId = req.user._id;
    if (!name || !description || !price || !category) {
      return res
        .status(400)
        .json({ message: "Please fill all the details of the Service" });
    }
    // if(!serviceImage){
    //     return res.status(400).json({message:"Service image not included."})
    // }
    const newService = new Service({
      name,
      description,
      price,
      category,
      // foodImage,
      duration,
      vendor: vendorId,
    });

    const serviceAdded = await newService.save();

    return res.status(200).json({ message: "New Item added", serviceAdded });
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
};

export const editService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const updateData = req.body;

    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      updateData,
      {
        new: true, // returns updated document
        runValidators: true, // runs schema validation
      }
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ message: "Service updated", updatedService });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getAllService = async (req, res) => {
  try {
    //   const vendorId = req.user._id
    const services = await Service.find();
    res.status(200).json({ message: "All Service fetched", services });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getVendorService = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";
    const category = req.query.category || "";
    const skip = (page - 1) * limit;

    const query = { vendor: id };
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    const total = await Service.countDocuments(query);
    let servicesQuery = Service.find(query).sort({ createdAt: -1 });

    if (req.query.export !== 'true') {
      servicesQuery = servicesQuery.skip(skip).limit(limit);
    }

    const vendorService = await servicesQuery;

    res.status(200).json({ 
      message: "Fetched all data", 
      vendorService,
      pagination: {
          total,
          page,
          limit: req.query.export === 'true' ? total : limit,
          pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(400).json({ message: "Error in getting vendor Services", error });
  }
};

export const deleteVendorService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const vendorService = await Service.findByIdAndDelete(serviceId);
    res.status(200).json({ message: "Item deleted", vendorService });
  } catch (error) {
    res.status(400).json({ message: "Error in getting vendor Service", error });
  }
};
