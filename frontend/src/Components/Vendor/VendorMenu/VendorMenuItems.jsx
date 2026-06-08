/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import AddEditMenuItemDrawer from "./AddMenuDrawer";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFoodData,
  getVendorFood,
} from "../../../api/vendor/vendorFoodApi";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  AlertCircle, 
  Pizza, 
  CheckCircle,
  HelpCircle,
  IndianRupee,
  ChevronDown,
  X
} from "lucide-react";

const VendorMenuItems = () => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [mode, setMode] = useState("add");

  // Custom modal states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const dispatch = useDispatch();
  const foods = useSelector((state) => state.vendorFood.menus.vendorFood);

  const handleAddClick = () => {
    setSelectedItem({
      name: "",
      category: "",
      price: "",
      image: "",
      description: "",
    });
    setMode("add");
    setDrawerOpen(true);
  };

  const handleEditClick = (item) => {
    setSelectedItem({
      id: item._id,
      name: item.name,
      category: item.category,
      price: item.price,
      image: item.imageUrl,
      description: item.description || "",
      status: item.status
    });
    setMode("edit");
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const triggerDelete = (id) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      dispatch(deleteFoodData(itemToDelete));
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  useEffect(() => {
    dispatch(getVendorFood());
  }, [dispatch]);

  // Reset page to 0 when search/filter changes
  useEffect(() => {
    setPage(0);
  }, [searchQuery, selectedCategory]);

  const filteredItems = foods?.filter((item) => {
    const name = item?.name || "";
    const category = item?.category || "";
    const description = item?.description || "";
    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
      name.toLowerCase().includes(query) ||
      category.toLowerCase().includes(query) ||
      description.toLowerCase().includes(query);

    const matchesCategory = selectedCategory
      ? item?.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const paginatedItems = filteredItems?.slice(
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
    <div className="py-6 px-1 max-w-full font-outfit select-none space-y-6">
      
      {/* Header Panel */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h2 className="text-2xl font-black text-base-content tracking-tight leading-none flex items-center gap-2">
            Menu Management
            <Pizza className="size-6 text-[#FF7D44]" />
          </h2>
          <p className="text-xs font-semibold text-base-content/50 mt-1.5">
            Configure dishes, update prices, manage availability, and add seasonal plates.
          </p>
        </div>
        
        <button
          onClick={handleAddClick}
          className="btn btn-warning h-12 rounded-xl text-white font-black text-xs shadow-xl shadow-orange-500/10 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 flex-shrink-0"
        >
          <Plus className="size-4" />
          Add New Item
        </button>
      </motion.div>

      {/* Filter and Search Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="flex flex-wrap items-center justify-between gap-4 p-5 bg-base-100 rounded-3xl border border-base-content/10 shadow-lg"
      >
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4.5 opacity-40" />
            <input 
              type="text" 
              placeholder="Search by name, desc..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-base-200 h-11 rounded-2xl pl-11 pr-4 font-bold outline-none border border-transparent focus:border-[#FF7D44]/30 transition-all text-xs"
            />
          </div>

          {/* Premium Dropdown instead of Select */}
          <div className="dropdown dropdown-bottom w-full sm:w-52">
            <div 
              tabIndex={0} 
              role="button" 
              className="w-full bg-base-200 h-11 rounded-2xl px-4 flex items-center justify-between font-bold text-xs cursor-pointer border border-transparent focus:border-[#FF7D44]/30 transition-all"
            >
              <span className="flex items-center gap-2">
                <Filter className="size-4 opacity-40" />
                {selectedCategory || "All Categories"}
              </span>
              <ChevronDown className="size-4 opacity-40" />
            </div>
            <ul 
              tabIndex={0} 
              className="dropdown-content menu p-2 bg-base-100 border border-base-content/10 rounded-2xl w-full z-[50] shadow-2xl mt-1 font-bold text-xs"
            >
              <li>
                <a 
                  onClick={() => {
                    setSelectedCategory("");
                    document.activeElement.blur();
                  }}
                >
                  All Categories
                </a>
              </li>
              {categories.map((cat) => (
                <li key={cat}>
                  <a 
                    onClick={() => {
                      setSelectedCategory(cat);
                      document.activeElement.blur();
                    }}
                  >
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-[10px] font-black uppercase tracking-widest opacity-40 pr-2">
          {filteredItems?.length || 0} Total Dishes
        </div>
      </motion.div>

      {/* Dishes Table */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-base-100 rounded-[2rem] border border-base-content/10 shadow-2xl overflow-hidden"
        style={{ height: 'calc(100vh - 280px)' }}
      >
        <div className="overflow-auto w-full h-full flex flex-col justify-between">
          <table className="table w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-base-200">
              <tr className="border-b border-base-content/10">
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Dish Photo</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Dish Name</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Category</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Price</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Status</th>
                <th className="py-5 px-6 text-center text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems && paginatedItems.length > 0 ? (
                paginatedItems.map((item, idx) => (
                  <motion.tr 
                    key={item._id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 + (idx * 0.05) }}
                    className="border-b border-base-content/5 hover:bg-base-200/30 transition-colors duration-200"
                  >
                    {/* Image Column */}
                    <td className="py-4 px-6">
                      <div 
                        onClick={() => item.imageUrl && setPreviewImage(item.imageUrl)}
                        className={`size-12 rounded-xl bg-base-200 overflow-hidden flex items-center justify-center border border-base-content/10 shadow-sm ${
                          item.imageUrl ? "cursor-zoom-in hover:scale-105 transition-transform" : ""
                        }`}
                        title={item.imageUrl ? "Click to view image" : ""}
                      >
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="size-full object-cover" />
                        ) : (
                          <Pizza className="size-5 text-[#FF7D44]" />
                        )}
                      </div>
                    </td>

                    {/* Name Column */}
                    <td className="py-4 px-6">
                      <div className="font-black text-sm text-base-content leading-tight">
                        {item.name}
                      </div>
                      <div className="text-[10px] font-bold opacity-45 truncate max-w-xs mt-0.5">
                        {item.description || "No description provided."}
                      </div>
                    </td>

                    {/* Category Column */}
                    <td className="py-4 px-6 text-xs font-black text-base-content/70">
                      <span className="bg-base-200 px-3 py-1.5 rounded-lg border border-base-content/5">
                        {item.category}
                      </span>
                    </td>

                    {/* Price Column */}
                    <td className="py-4 px-6 text-sm font-black text-[#FF7D44]">
                      <div className="flex items-center gap-0.5">
                        <IndianRupee className="size-3.5" />
                        <span>{item.price}</span>
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        item.status === 'Available' 
                          ? 'bg-success/10 text-success border border-success/20' 
                          : 'bg-base-content/10 text-base-content/40 border border-base-content/10'
                      }`}>
                        {item.status || "Available"}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEditClick(item)}
                          className="p-2 rounded-xl bg-base-200 hover:bg-warning hover:text-white text-base-content/60 transition-all cursor-pointer"
                          title="Edit Item"
                        >
                          <Edit className="size-4" />
                        </button>
                        <button 
                          onClick={() => triggerDelete(item._id)}
                          className="p-2 rounded-xl bg-base-200 hover:bg-error hover:text-white text-base-content/60 transition-all cursor-pointer"
                          title="Delete Item"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>

                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 px-6 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="size-12 rounded-2xl bg-base-200 flex items-center justify-center text-base-content/30 mb-2">
                        <AlertCircle className="size-6" />
                      </div>
                      <h4 className="font-black text-lg text-base-content/70">No Menu Items Found</h4>
                      <p className="text-xs font-semibold text-base-content/40 max-w-sm">
                        You have not registered any dishes. Click the "Add New Item" button at the top to populate your catering menu!
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Custom Pagination Footer */}
          <div className="flex justify-between items-center p-5 border-t border-base-content/10 bg-base-200/50 mt-auto">
            <span className="text-xs font-semibold text-base-content/50">
              Showing {filteredItems?.length ? page * rowsPerPage + 1 : 0} to {Math.min((page + 1) * rowsPerPage, filteredItems?.length || 0)} of {filteredItems?.length || 0} items
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="btn btn-ghost btn-sm rounded-lg font-black text-xs cursor-pointer disabled:opacity-35"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => ((p + 1) * rowsPerPage < (filteredItems?.length || 0) ? p + 1 : p))}
                disabled={(page + 1) * rowsPerPage >= (filteredItems?.length || 0)}
                className="btn btn-ghost btn-sm rounded-lg font-black text-xs cursor-pointer disabled:opacity-35"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Form Drawer */}
      <AnimatePresence>
        {drawerOpen && selectedItem && (
          <AddEditMenuItemDrawer
            open={drawerOpen}
            onClose={handleDrawerClose}
            initialValues={selectedItem}
            mode={mode}
            setMode={setMode}
          />
        )}
      </AnimatePresence>

      {/* Glassmorphic Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="w-full max-w-sm p-6 bg-base-100/90 backdrop-blur-md border border-base-content/10 rounded-3xl shadow-2xl font-outfit"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="size-10 rounded-xl bg-error/10 text-error flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="size-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-base-content">Delete Menu Item</h3>
                  <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider mt-0.5">Are you absolutely sure?</p>
                </div>
              </div>
              <p className="text-xs font-semibold text-base-content/60 leading-relaxed mb-6">
                This item will be permanently removed from your catering menu. Customers will no longer be able to order it.
              </p>
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="btn btn-ghost rounded-xl text-xs font-black px-4 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="btn btn-error text-white rounded-xl text-xs font-black px-5 cursor-pointer shadow-lg shadow-error/15"
                >
                  Delete Item
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Glassmorphic Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md cursor-zoom-out"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative p-2 bg-base-100/20 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-w-xl max-h-[85vh] m-4"
              onClick={(e) => e.stopPropagation()} // Stop closing when clicking image card
            >
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/55 hover:bg-black/75 text-white cursor-pointer transition-colors z-20"
              >
                <X className="size-5" />
              </button>
              <img src={previewImage} alt="Dish Preview" className="w-full max-h-[75vh] object-contain rounded-2xl" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default VendorMenuItems;
