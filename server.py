from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permite acceso desde cualquier dispositivo

# Datos iniciales
productos = [
    { "nombre": "Leche", "categoria": "Alimentos", "stock": 1, "minimo": 2 },
    { "nombre": "Fideos", "categoria": "Alimentos", "stock": 0, "minimo": 1 },
    { "nombre": "Detergente", "categoria": "Limpieza", "stock": 1, "minimo": 1 },
    { "nombre": "Tomate", "categoria": "Verdulería", "stock": 0, "minimo": 2 }
]

@app.route("/productos", methods=["GET"])
def get_productos():
    return jsonify(productos)

@app.route("/productos", methods=["POST"])
def guardar_productos():
    global productos
    productos = request.get_json()
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
