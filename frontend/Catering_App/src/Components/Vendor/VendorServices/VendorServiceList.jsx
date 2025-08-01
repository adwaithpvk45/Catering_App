import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  TablePagination,
  Chip,
} from "@mui/material";
import AddEditServiceDrawer from "./AddServiceDrawer";
import { useDispatch, useSelector } from "react-redux";
import { deleteServiceData, getVendorService } from "../../../api/vendor/vendorServiceApi";

const VendorServices = () => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [mode, setMode] = useState("add");
  const dispatch = useDispatch();
  const services = useSelector(
    (state) => state.vendorService.services.vendorService
  );

  const serviceTypes = [
    "Wedding",
    "Birthday",
    "Graduation Party",
    "Housewarming",
    "Anniversary",
    "Others",
  ];

  // const [services, setServices] = useState([
  //   {
  //     id: 1,
  //     serviceName: "Wedding Catering",
  //     serviceType: "Catering",
  //     rate: "₹500/head",
  //     duration: "5 hrs",
  //     status: "Available",
  //     description:
  //       "Premium catering service offering a wide range of cuisines and beverages tailored for weddings.",
  //   },
  //   {
  //     id: 2,
  //     serviceName: "Birthday Decoration",
  //     serviceType: "Decoration",
  //     rate: "₹3000",
  //     duration: "4 hrs",
  //     status: "Unavailable",
  //     description:
  //       "Creative decoration services including balloons, lighting, and theme-based setups for birthday parties.",
  //   },
  //   {
  //     id: 3,
  //     serviceName: "Event Photography",
  //     serviceType: "Photography",
  //     rate: "₹10,000",
  //     duration: "8 hrs",
  //     status: "Available",
  //     description:
  //       "Professional photography service covering candid and posed shots for events and special occasions.",
  //   },
  //   {
  //     id: 4,
  //     serviceName: "DJ Services",
  //     serviceType: "Entertainment",
  //     rate: "₹7,000",
  //     duration: "6 hrs",
  //     status: "Available",
  //     description:
  //       "Energetic DJ setup with lights and sound system for weddings, parties, and events.",
  //   },
  //   {
  //     id: 5,
  //     serviceName: "Corporate Lunch",
  //     serviceType: "Catering",
  //     rate: "₹400/head",
  //     duration: "3 hrs",
  //     status: "Available",
  //     description:
  //       "Custom lunch menus for corporate events with timely delivery and serving staff.",
  //   },
  //   {
  //     id: 6,
  //     serviceName: "Floral Decoration",
  //     serviceType: "Decoration",
  //     rate: "₹5000",
  //     duration: "4 hrs",
  //     status: "Unavailable",
  //     description:
  //       "Elegant floral arrangements and installations for weddings and formal events.",
  //   },
  //   {
  //     id: 7,
  //     serviceName: "Live Band",
  //     serviceType: "Entertainment",
  //     rate: "₹15,000",
  //     duration: "5 hrs",
  //     status: "Available",
  //     description:
  //       "Live music performance by professional musicians, ideal for receptions and parties.",
  //   },
  //   {
  //     id: 8,
  //     serviceName: "Mehndi Artist",
  //     serviceType: "Beauty",
  //     rate: "₹2000",
  //     duration: "2 hrs",
  //     status: "Available",
  //     description:
  //       "Skilled mehndi artist offering traditional and modern designs for brides and guests.",
  //   },
  //   {
  //     id: 9,
  //     serviceName: "Video Coverage",
  //     serviceType: "Photography",
  //     rate: "₹12,000",
  //     duration: "8 hrs",
  //     status: "Unavailable",
  //     description:
  //       "High-definition video recording and editing for complete event documentation.",
  //   },
  //   {
  //     id: 10,
  //     serviceName: "Stage Setup",
  //     serviceType: "Decoration",
  //     rate: "₹6000",
  //     duration: "3 hrs",
  //     status: "Available",
  //     description:
  //       "Custom stage design and setup for performances, speeches, and ceremonies.",
  //   },
  // ]);

  // const services = useSelector((state) => state.vendorService.services.vendorFood);

  const filteredServices = services?.filter((item) => {
    const matchesSearch = item?.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = selectedType ? item?.category === selectedType : true;
    return matchesSearch && matchesType;
  });

  const paginatedServices = filteredServices?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleAddClick = () => {
    setSelectedService({
      name: "",
      category: "",
      price: "",
      duration: "",
      description: "",
      imageUrl: "",
    });
    setDrawerOpen(true);
    setMode("add");
  };

  const handleEditClick = (service) => {
    setSelectedService(service);
    setDrawerOpen(true);
    setMode("edit");
  };

  useEffect(() => {
    dispatch(getVendorService());
  }, []);

  const handleDeleteItem = (id) => {
    dispatch(deleteServiceData(id));
    // setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <Box sx={{ paddingY: "30px", maxWidth: "100%" }}>
      <Typography variant="h4" mb={3}>
        Vendor Services
      </Typography>
      <Box
        display="flex"
        justifyContent={"flex-end"}
        gap={2}
        flexWrap="wrap"
        mb={2}
      >
        <TextField
          label="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <TextField
          select
          label="Filter by Type"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All</MenuItem>
          {serviceTypes?.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          onClick={handleAddClick}
          sx={{ ml: "auto", height: 50 }}
        >
          Add New Service
        </Button>
      </Box>

      <Paper sx={{ borderRadius: "10px", overflow: "clip" }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#ED6C02" }}>
              <TableRow>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Type</strong>
                </TableCell>
                <TableCell>
                  <strong>Rate</strong>
                </TableCell>
                <TableCell>
                  <strong>Duration</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedServices?.map((service) => (
                <TableRow
                  key={service?._id}
                  hover
                  // onClick={() => handleEditClick(service)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{service?.name}</TableCell>
                  <TableCell>{service?.category}</TableCell>
                  <TableCell>{service?.price}</TableCell>
                  <TableCell>{service?.duration}</TableCell>
                  <TableCell>
                    <Chip
                      label={service?.status}
                      color={
                        service.status === "Available" ? "success" : "default"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEditClick(service)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleDeleteItem(service._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredServices?.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]}
        />
      </Paper>

      <AddEditServiceDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initialValues={selectedService}
        serviceTypes={serviceTypes}
        mode={mode}
        setMode={setMode}
      />
    </Box>
  );
};

export default VendorServices;
