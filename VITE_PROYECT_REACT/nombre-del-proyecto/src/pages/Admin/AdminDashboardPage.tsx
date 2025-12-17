// src/pages/Admin/AdminDashboardPage.tsx
import { useEffect, useState, FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authHeader } from "../../services/auth";
import styles from "./AdminDashboardPage.module.css";

const API_URL = "/api";

type Product = {
  id?: number;
  name: string;
  price: number;
  stock: number;
  description?: string;
  image?: string;
  offer: boolean;
  categories: string[];
};

type FormState = {
  id?: number;
  name: string;
  price: string;
  stock: string;
  description: string;
  image: string;
  offer: boolean;
  categoriesText: string; // "Juegos, Ofertas"
};

export default function AdminDashboardPage() {
  const { user } = useAuth();

  // 🔐 Solo admin
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "ROLE_ADMIN") return <Navigate to="/" replace />;

  const initials =
    user.fullName && user.fullName.trim().length > 0
      ? user.fullName
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((p) => p[0].toUpperCase())
          .join("")
      : (user.username?.[0] || "?").toUpperCase();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    id: undefined,
    name: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    offer: false,
    categoriesText: "",
  });

  const isEditing = form.id !== undefined;

  // ========= Helpers de API =========
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/products`, {
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
      });
      if (!res.ok) throw new Error("No se pudo cargar la lista de productos");
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (e: any) {
      setError(e.message || "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setForm({
      id: undefined,
      name: "",
      price: "",
      stock: "",
      description: "",
      image: "",
      offer: false,
      categoriesText: "",
    });
  };

  const handleEditClick = (p: Product) => {
    setForm({
      id: p.id,
      name: p.name,
      price: String(p.price ?? ""),
      stock: String(p.stock ?? ""),
      description: p.description ?? "",
      image: p.image ?? "",
      offer: p.offer ?? false,
      categoriesText: (p.categories ?? []).join(", "),
    });
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!window.confirm("¿Eliminar este producto?")) return;

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          ...authHeader(),
        },
      });
      if (!res.ok) throw new Error("No se pudo eliminar el producto");
      // refrescar lista
      await fetchProducts();
    } catch (e: any) {
      alert(e.message || "Error al eliminar");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // validación básica
    if (!form.name.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    const priceNum = Number(form.price);
    const stockNum = Number(form.stock);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      alert("Precio inválido");
      return;
    }
    if (Number.isNaN(stockNum) || stockNum < 0) {
      alert("Stock inválido");
      return;
    }

    const payload: Product = {
      name: form.name.trim(),
      price: priceNum,
      stock: stockNum,
      description: form.description.trim() || "",
      image: form.image.trim() || "",
      offer: form.offer,
      categories: form.categoriesText
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    };

    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `${API_URL}/products/${form.id}`
        : `${API_URL}/products`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(
          isEditing
            ? "No se pudo actualizar el producto"
            : "No se pudo crear el producto"
        );
      }

      // refrescamos y limpiamos
      await fetchProducts();
      resetForm();
    } catch (e: any) {
      alert(e.message || "Error al guardar producto");
    }
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.card}>
        {/* Avatar + info admin (similar al perfil) */}
        <div className={styles.headerSection}>
          <div className={styles.avatarCircle}>
            <span className={styles.avatarInitials}>{initials}</span>
          </div>

          <div className={styles.heading}>
            <h1 className={styles.title}>{user.fullName || user.username}</h1>
            <p className={styles.subtitle}>Panel de administración</p>

            <div className={styles.roleBadgeRow}>
              <span className={`${styles.badge} ${styles.badgeAdmin}`}>
                Administrador
              </span>
              <span className={styles.usernameTag}>@{user.username}</span>
            </div>
          </div>
        </div>

        {/* Texto meta */}
        <div className={styles.metaBox}>
          <p className={styles.metaText}>
            Desde este panel puedes{" "}
            <strong>crear, actualizar y eliminar</strong> productos de la
            tienda. Las operaciones se reflejan directamente en el backend
            protegido con JWT y rol <code>ROLE_ADMIN</code>.
          </p>
        </div>

        {/* Grid: listado + formulario */}
        <div className={styles.grid}>
          {/* Lista de productos */}
          <div className={styles.listPanel}>
            <h2 className={styles.panelTitle}>Productos existentes</h2>

            {loading && <p className={styles.muted}>Cargando productos...</p>}
            {error && <p className={styles.errorText}>{error}</p>}

            {!loading && !error && products.length === 0 && (
              <p className={styles.muted}>No hay productos registrados.</p>
            )}

            {!loading && !error && products.length > 0 && (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th className={styles.thCenter}>Stock</th>
                      <th className={styles.thRight}>Precio</th>
                      <th className={styles.thCenter}>Oferta</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td className={styles.tdCenter}>{p.stock}</td>
                        <td className={styles.tdRight}>
                          ${p.price.toLocaleString("es-CL")}
                        </td>
                        <td className={styles.tdCenter}>
                          {p.offer ? "Sí" : "No"}
                        </td>
                        <td className={styles.tdRight}>
                          <button
                            type="button"
                            className={styles.smallBtn}
                            onClick={() => handleEditClick(p)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className={styles.smallBtnDanger}
                            onClick={() => handleDelete(p.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Formulario de creación / edición */}
          <div className={styles.formPanel}>
            <h2 className={styles.panelTitle}>
              {isEditing ? "Editar producto" : "Nuevo producto"}
            </h2>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Nombre</label>
                <input
                  className={styles.input}
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Precio (CLP)</label>
                  <input
                    className={styles.input}
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price: e.target.value }))
                    }
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Stock</label>
                  <input
                    className={styles.input}
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, stock: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>URL imagen</label>
                <input
                  className={styles.input}
                  value={form.image}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, image: e.target.value }))
                  }
                  placeholder="/imgs/ejemplo.png"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Descripción</label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Categorías (separadas por coma)
                </label>
                <input
                  className={styles.input}
                  value={form.categoriesText}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, categoriesText: e.target.value }))
                  }
                  placeholder="Juegos, Ofertas"
                />
              </div>

              <div className={styles.fieldCheckbox}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={form.offer}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, offer: e.target.checked }))
                    }
                  />
                  <span>Marcar como producto en oferta</span>
                </label>
              </div>

              <div className={styles.formActions}>
                {isEditing && (
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={resetForm}
                  >
                    Cancelar edición
                  </button>
                )}
                <button type="submit" className={styles.primaryBtn}>
                  {isEditing ? "Guardar cambios" : "Crear producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
