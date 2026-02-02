export function mapBusinessError(status?: number) {
    switch (status) {
        case 409:
            return {
                title: "Cupo agotado",
                description:
                    "Esta ventana de despacho ya no tiene disponibilidad. Prueba otro horario o fecha.",
            }
        case 400:
            return {
                title: "Solicitud inválida",
                description:
                    "Revisa la dirección ingresada e inténtalo nuevamente.",
            }
        default:
            return {
                title: "Error inesperado",
                description:
                    "No fue posible completar la acción. Intenta nuevamente.",
            }
    }
}
