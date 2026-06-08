/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import AddEditServiceDrawer from "./AddServiceDrawer";
import { useDispatch, useSelector } from "react-redux";
import { deleteServiceData, getVendorService } from "../../../api/vendor/vendorServiceApi";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  AlertCircle,
  Sparkles,
  Clock,
  IndianRupee,
  ChevronDown,
} from "lucide-react";

const VendorServices = () => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [mode, setMode] = useState("add");

  // Custom modal states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

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

  const filteredServices = services?.filter((item) => {
    const name = item?.name || "";
    const category = item?.category || "";
    const description = item?.description || "";
    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
      name.toLowerCase().includes(query) ||
      category.toLowerCase().includes(query) ||
      description.toLowerCase().includes(query);

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
    setMode("add");
    setDrawerOpen(true);
  };

  const handleEditClick = (service) => {
    setSelectedService(service);
    setMode("edit");
    setDrawerOpen(true);
  };

  const triggerDelete = (id) => {
    setServiceToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      dispatch(deleteServiceData(serviceToDelete));
      setDeleteConfirmOpen(false);
      setServiceToDelete(null);
    }
  };

  useEffect(() => {
    dispatch(getVendorService());
  }, [dispatch]);

  // Reset page to 0 when search/filter changes
  useEffect(() => {
    setPage(0);
  }, [searchQuery, selectedType]);

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
            Service Management
            <Sparkles className="size-6 text-[#FF7D44]" />
          </h2>
          <p className="text-xs font-semibold text-base-content/50 mt-1.5">
            Configure catering services, rates per head, session durations, and availability.
          </p>
        </div>

        <button
          onClick={handleAddClick}
          className="btn btn-warning h-12 rounded-xl text-white font-black text-xs shadow-xl shadow-orange-500/10 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 flex-shrink-0"
        >
          <Plus className="size-4" />
          Add New Service
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

          {/* Service Type Dropdown */}
          <div className="dropdown dropdown-bottom w-full sm:w-52">
            <div
              tabIndex={0}
              role="button"
              className="w-full bg-base-200 h-11 rounded-2xl px-4 flex items-center justify-between font-bold text-xs cursor-pointer border border-transparent focus:border-[#FF7D44]/30 transition-all"
            >
              <span className="flex items-center gap-2">
                <Filter className="size-4 opacity-40" />
                {selectedType || "All Service Types"}
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
                    setSelectedType("");
                    document.activeElement.blur();
                  }}
                >
                  All Service Types
                </a>
              </li>
              {serviceTypes.map((type) => (
                <li key={type}>
                  <a
                    onClick={() => {
                      setSelectedType(type);
                      document.activeElement.blur();
                    }}
                  >
                    {type}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-[10px] font-black uppercase tracking-widest opacity-40 pr-2">
          {filteredServices?.length || 0} Total Services
        </div>
      </motion.div>

      {/* Services Table */}
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
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Service Name</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Service Type</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Rate</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Duration</th>
                <th className="py-5 px-6 text-left text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Status</th>
                <th className="py-5 px-6 text-center text-xs font-black uppercase tracking-widest opacity-80 text-base-content">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedServices && paginatedServices.length > 0 ? (
                paginatedServices.map((service, idx) => (
                  <motion.tr
                    key={service._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 + idx * 0.05 }}
                    className="border-b border-base-content/5 hover:bg-base-200/30 transition-colors duration-200"
                  >
                    {/* Name & description */}
                    <td className="py-4 px-6">
                      <div className="font-black text-sm text-base-content leading-tight">
                        {service.name}
                      </div>
                      <div className="text-[10px] font-bold opacity-45 truncate max-w-xs mt-0.5">
                        {service.description || "No description provided."}
                      </div>
                    </td>

                    {/* Category / Type */}
                    <td className="py-4 px-6 text-xs font-black text-base-content/70">
                      <span className="bg-base-200 px-3 py-1.5 rounded-lg border border-base-content/5">
                        {service.category}
                      </span>
                    </td>

                    {/* Rate */}
                    <td className="py-4 px-6 text-sm font-black text-[#FF7D44]">
                      <div className="flex items-center gap-0.5">
                        <IndianRupee className="size-3.5" />
                        <span>{service.price}</span>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="py-4 px-6 text-xs font-black text-base-content/70">
                      <div className="flex items-center gap-1">
                        <Clock className="size-3.5 opacity-40" />
                        <span>{service.duration}</span>
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          service.status === "Available"
                            ? "bg-success/10 text-success border border-success/20"
                            : "bg-base-content/10 text-base-content/40 border border-base-content/10"
                        }`}
                      >
                        {service.status || "Available"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(service)}
                          className="p-2 rounded-xl bg-base-200 hover:bg-warning hover:text-white text-base-content/60 transition-all cursor-pointer"
                          title="Edit Service"
                        >
                          <Edit className="size-4" />
                        </button>
                        <button
                          onClick={() => triggerDelete(service._id)}
                          className="p-2 rounded-xl bg-base-200 hover:bg-error hover:text-white text-base-content/60 transition-all cursor-pointer"
                          title="Delete Service"
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
                      <h4 className="font-black text-lg text-base-content/70">No Services Found</h4>
                      <p className="text-xs font-semibold text-base-content/40 max-w-sm">
                        You have not registered any services. Click the "Add New Service" button at the top to configure services.
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
              Showing {filteredServices?.length ? page * rowsPerPage + 1 : 0} to{" "}
              {Math.min((page + 1) * rowsPerPage, filteredServices?.length || 0)} of{" "}
              {filteredServices?.length || 0} services
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="btn btn-ghost btn-sm rounded-lg font-black text-xs cursor-pointer disabled:opacity-35"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setPage((p) =>
                    (p + 1) * rowsPerPage < (filteredServices?.length || 0) ? p + 1 : p
                  )
                }
                disabled={(page + 1) * rowsPerPage >= (filteredServices?.length || 0)}
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
        {drawerOpen && selectedService && (
          <AddEditServiceDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            initialValues={selectedService}
            serviceTypes={serviceTypes}
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
                  <h3 className="font-black text-base text-base-content">Delete Service</h3>
                  <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-wider mt-0.5">Are you absolutely sure?</p>
                </div>
              </div>
              <p className="text-xs font-semibold text-base-content/60 leading-relaxed mb-6">
                This service will be permanently deleted. Customers will no longer be able to book this specific service.
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
                  Delete Service
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default VendorServices;
