function DashboardPage() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p>Welcome to your dashboard, {user ? user.name : "Guest"}!</p>
      <p>Here you can see an overview of your financial activities.</p>
    </div>
  );
}

export default DashboardPage;
