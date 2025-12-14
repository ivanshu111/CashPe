import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../slice/categorySlice';
import toast from 'react-hot-toast';

const CategoryManagementPage = () => {
    const dispatch = useDispatch();
    const { categories, status, error } = useSelector((state) => state.categories);
    const { user } = useSelector((state) => state.auth); // Assuming user role is in auth state

    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null); // Stores the category being edited
    const [editedCategoryName, setEditedCategoryName] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCategories());
        }
    }, [status, dispatch]);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (newCategoryName.trim()) {
            try {
                await dispatch(addCategory({ name: newCategoryName })).unwrap();
                toast.success('Category added successfully!');
                setNewCategoryName('');
                setShowAddForm(false);
            } catch (err) {
                toast.error(err.message || 'Failed to add category.');
            }
        }
    };

    const handleEditClick = (category) => {
        setEditingCategory(category);
        setEditedCategoryName(category.name);
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        if (editedCategoryName.trim() && editingCategory) {
            try {
                await dispatch(updateCategory({ id: editingCategory._id, categoryData: { name: editedCategoryName } })).unwrap();
                toast.success('Category updated successfully!');
                setEditingCategory(null);
                setEditedCategoryName('');
            } catch (err) {
                toast.error(err.message || 'Failed to update category.');
            }
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await dispatch(deleteCategory(id)).unwrap();
                toast.success('Category deleted successfully!');
            } catch (err) {
                toast.error(err.message || 'Failed to delete category. Check if it has linked expenses.');
            }
        }
    };

    if (status === 'loading' && categories.length === 0) {
        return <div className="text-center py-8">Loading Categories...</div>;
    }

    if (status === 'failed') {
        return <div className="text-center py-8 text-red-500">Error: {error ? error.message : 'Something went wrong'}</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Categories</h1>

            {/* Add Category Form */}
            <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                    {showAddForm ? 'Hide Add Category Form' : 'Add New Category'}
                </button>
                {showAddForm && (
                    <form onSubmit={handleAddCategory} className="mt-4">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="New category name"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                            >
                                Add
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Categories List */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Categories</h2>
                {categories.length === 0 ? (
                    <p className="text-gray-600">No categories found. Add one above!</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {categories.map((category) => (
                            <li key={category._id} className="py-4 flex justify-between items-center">
                                {editingCategory && editingCategory._id === category._id ? (
                                    <form onSubmit={handleUpdateCategory} className="flex-1 flex items-center space-x-2">
                                        <input
                                            type="text"
                                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            value={editedCategoryName}
                                            onChange={(e) => setEditedCategoryName(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="submit"
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditingCategory(null)}
                                            className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-lg text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </form>
                                ) : (
                                    <>
                                        <span className="text-lg text-gray-800 flex items-center flex-wrap"> {/* Add flex and items-center */}
                                            {category.name}
                                            {category.userId === null && <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">Global</span>}
                                            {category.userId === user.id && ( // Place buttons directly here for adjacency
                                                <div className="flex space-x-2 ml-4"> {/* Adjust ml for spacing */}
                                                    <button
                                                        onClick={() => handleEditClick(category)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium" // Small button styles
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCategory(category._id)}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-xs font-medium" // Small button styles
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </span>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CategoryManagementPage;
