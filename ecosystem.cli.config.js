module.exports = {
	apps: [
		{
			name: 'cron:create_api_user',
			script: 'dist/cli/main.js',
			args: 'create_api_user',
			autorestart: false,
			log_date_format: 'YYYY-MM-DD HH:mm:ss',
			env: {
				TZ: 'America/Sao_Paulo'
			}
		}
	]
};
