const pool = require("../../config/pool_conexoes");

const UsuarioModel = {
    create: async (data) => {
        try {
            const [resultados] = await pool.query(
                'INSERT INTO USUARIOS (`nome_usuario`, `email_usuario`, `user_usuario`, `data_nasc_usuario`, `cidade_usuario`, `senha_usuario`, `tipo_usuario_id` ) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [data.nome, data.email, data.user, data.nasc, data.cidade, data.senha, data.tipo_usuario_id]
            );
            return resultados;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    findById: async (id) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM USUARIOS WHERE id_usuario = ?', [id]);
            return linhas;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    findUserEmail: async (email) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM USUARIOS WHERE email_usuario = ? ', [email]);
            return linhas;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    findUserByUsername: async (username) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM USUARIOS WHERE user_usuario = ?', [username]);
            return linhas;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    update: async (data, id) => {
       /*  console.log('Dados a serem atualizados:', data);
        console.log('ID do usuário:', id); */
    
        if (!id || !data) {
            /* console.log('ID ou dados inválidos.'); */
            return; // Ou lançar um erro
        }
    
        try {
            // Verifica se o usuário existe
            const [rows] = await pool.query("SELECT id_usuario FROM USUARIOS WHERE id_usuario = ?", [id]);
            if (rows.length === 0) {
                console.log(`Usuário com ID ${id} não encontrado.`);
                return; // Ou lançar um erro
            }
    
            // Atualiza a senha
            const [resultados] = await pool.query(
                "UPDATE USUARIOS SET ? WHERE id_usuario = ?",
                [data, id]
            );
    
            if (resultados.affectedRows === 0) {
                console.log(`Nenhuma linha foi afetada. ID do usuário ${id} não encontrado.`);
                return; // Ou lançar um erro
            }
    
            return resultados;
        } catch (error) {
            console.log("Erro ao atualizar o usuário:", error);
            throw error;
        }
    },
    

    atualizarSenhaUser: async (id, senha) => { 
        try {
          
            if (!senha) {
                throw new Error('Senha não pode ser null ou undefined');
            }
    
            const [resultados] = await pool.query(
                'UPDATE USUARIOS SET senha_usuario = ? WHERE id_usuario = ?',
                [senha, id]
            );
    
            return resultados;
        } catch (error) {
            console.log(error);
            throw error; // Propaga o erro para tratamento posterior
        }
    },
    
    delete: async (id) => {
        try {
            const [resultados] = await pool.query(
                "UPDATE USUARIOS SET status_usuario = 0 WHERE id_usuario = ? ", [id]
            )
            return resultados;
        } catch (error) {
            console.log(error);
            return error;
        }
    },

    // Novo método para buscar o perfil do usuário (com JOIN para empresas)
    buscarPerfilUsuario: async (userId) => {
        const query = `
            SELECT 
              U.id_usuario, U.nome_usuario, U.data_nasc_usuario, U.foto_usuario,
              U.cidade_usuario, U.uf_usuario, U.email_usuario, U.senha_usuario, 
              U.user_usuario, U.telefone_usuario, U.tipo_usuario_id, U.bio,
              I.razao_social_instituicao, I.cnpj_instituicao, I.logo_instituicao
            FROM USUARIOS U
            LEFT JOIN INSTITUICOES I 
              ON U.id_usuario = I.USUARIOS_id_usuario
            WHERE U.id_usuario = ?`;

        try {
            const [rows] = await pool.query(query, [userId]);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Erro ao buscar perfil do usuário:', error);
            throw error;
        }
    }
};

module.exports = UsuarioModel;
