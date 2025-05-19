import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Chip,
  TablePagination,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import AddEditMenuItemDrawer from "./AddMenuDrawer"; // Adjust the path based on your project structure

const VendorMenuItems = () => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: "Butter Chicken",
      category: "Main Course",
      price: "₹250",
      image: "https://source.unsplash.com/80x80/?butter-chicken",
      status: "Available",
      description: "A rich and creamy North Indian chicken curry made with tomatoes, butter, and aromatic spices.",
    },
    {
      id: 2,
      name: "Gulab Jamun",
      category: "Desserts",
      price: "₹100",
      image: "https://source.unsplash.com/80x80/?gulab-jamun",
      status: "Unavailable",
      description: "Soft deep-fried dough balls soaked in a cardamom-flavored sugar syrup.",
    },
    {
      id: 3,
      name: "Paneer Tikka",
      category: "Starters",
      price: "₹180",
      image: "https://source.unsplash.com/80x80/?paneer-tikka",
      status: "Available",
      description: "Chunks of paneer marinated in spicy yogurt, skewered and grilled to perfection.",
    },
    {
      id: 4,
      name: "Veg Biryani",
      category: "Main Course",
      price: "₹200",
      image: "https://source.unsplash.com/80x80/?biryani",
      status: "Available",
      description: "Aromatic rice dish cooked with fresh vegetables and Indian spices, served with raita.",
    },
    {
      id: 5,
      name: "Masala Dosa",
      category: "Snacks",
      price: "₹90",
      image: "https://source.unsplash.com/80x80/?masala-dosa",
      status: "Unavailable",
      description: "Crispy South Indian crepe filled with a flavorful spiced potato mixture.",
    },
    {
      id: 6,
      name: "Chicken Lollipop",
      category: "Starters",
      price: "₹220",
      image: "https://source.unsplash.com/80x80/?chicken-lollipop",
      status: "Available",
      description: "Spicy Indo-Chinese style chicken wings served as an appetizer or snack.",
    },
    {
      id: 7,
      name: "Fruit Salad",
      category: "Desserts",
      price: "₹80",
      image: "https://source.unsplash.com/80x80/?fruit-salad",
      status: "Available",
      description: "A refreshing mix of seasonal fruits served chilled with a touch of honey or cream.",
    },
    {
      id: 8,
      name: "Cold Coffee",
      category: "Drinks",
      price: "₹70",
      image: "https://source.unsplash.com/80x80/?cold-coffee",
      status: "Available",
      description: "Chilled, frothy coffee drink blended with ice and milk for a refreshing boost.",
    },
    {
      id: 9,
      name: "Idli Sambar",
      category: "Snacks",
      price: "₹60",
      image: "https://source.unsplash.com/80x80/?idli-sambar",
      status: "Unavailable",
      description: "Soft steamed rice cakes served with a tangy and spicy lentil-based vegetable stew.",
    },
    {
      id: 10,
      name: "Tandoori Roti",
      category: "Main Course",
      price: "₹20",
      image: "https://source.unsplash.com/80x80/?tandoori-roti",
      status: "Available",
      description: "Traditional Indian flatbread cooked in a tandoor, best enjoyed with curry dishes.",
    },
  ]);
  
  const handleAddClick = () => {
    setSelectedItem({
      name: "",
      category: "",
      price: "",
      image: "",
      description: "",
    });
    setDrawerOpen(true);
  };

  const handleEditClick = (item) => {
    setSelectedItem({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      image: item.image,
      description: item.description || "",
    });
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleDeleteItem = (id) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleStatus = (id) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "Available" ? "Unavailable" : "Available",
            }
          : item
      )
    );
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? item.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const handleFormSubmit = (data) => {
    if (data.id) {
      // Update existing
      setMenuItems((prev) =>
        prev.map((item) => (item.id === data.id ? { ...item, ...data } : item))
      );
    } else {
      // Add new
      const newItem = { ...data, id: Date.now() };
      setMenuItems((prev) => [...prev, newItem]);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedItems = filteredItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const categories = [
    "Starters",
    "Main Course",
    "Desserts",
    "Drinks",
    "Snacks",
  ];

  return (
    <Box sx={{ paddingY: "30px", maxWidth: "100%" }}>
      <Typography variant="h4" mb={3}>
        Vendor Menu Items
      </Typography>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          mt: "40px",
        }}
      >
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <TextField
            label="Search by name"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: 200 }}
          />

          <TextField
            select
            label="Filter by Category"
            variant="outlined"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Button
          variant="contained"
          onClick={handleAddClick}
          sx={{ mb: 2, ml: 3, height: "50px" }}
        >
          Add New Item
        </Button>
      </Box>

      <Paper sx={{ borderRadius: "10px", overflow: "clip" }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#ED6C02" }}>
              <TableRow>
                <TableCell>
                  <strong>Image</strong>
                </TableCell>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Category</strong>
                </TableCell>
                <TableCell>
                  <strong>Price</strong>
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
              {paginatedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <img src={item.image} alt={item.name} width="50" />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.status}
                      color={
                        item.status === "Available" ? "success" : "default"
                      }
                      onClick={() => handleToggleStatus(item.id)}
                      sx={{ cursor: "pointer" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEditClick(item)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleDeleteItem(item.id)}
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
          count={menuItems.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]}
        />
      </Paper>
      <AddEditMenuItemDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        onSubmit={handleFormSubmit}
        initialValues={selectedItem}
      />
    </Box>
  );
};

export default VendorMenuItems;
