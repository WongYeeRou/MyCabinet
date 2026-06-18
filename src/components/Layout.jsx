import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div style={styles.page}>
      <Sidebar />

      <main style={styles.content}>
        {children}
      </main>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#ffffff"
  },

  content: {
    flex: 1,
    padding: "30px"
  }
};

export default Layout;