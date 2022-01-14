module.exports = {
	apps: [
		{
			name: 'api_gateway',
			script: 'dist/api_gateway/main.js',
			env: {
				TZ: 'America/Sao_Paulo'
			}
		},
		{
			name: 'microservice_customers',
			script: 'dist/microservices/customers/main.js',
			env: {
				TZ: 'America/Sao_Paulo'
			}
		}
	]
};
