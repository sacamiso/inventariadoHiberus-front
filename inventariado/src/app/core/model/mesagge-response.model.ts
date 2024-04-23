export interface MesaggeResponse {
    success: boolean;
    error:   string;
    message: string;
}

export interface MesaggeResponseBoolean {
    success: boolean;
    error:   string;
    message: boolean;
}

export interface MesaggeResponseNumber {
    success: boolean;
    error:   string;
    message: number;
}