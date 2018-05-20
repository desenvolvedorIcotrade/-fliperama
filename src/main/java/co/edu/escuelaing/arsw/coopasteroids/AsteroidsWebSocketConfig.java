package co.edu.escuelaing.arsw.coopasteroids;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;



/**
 * Configuration of the Message Broker
 * @author Daniel Ospina
 */
@Configuration
@EnableWebSocketMessageBroker
public class AsteroidsWebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Value("${rabbitmq.host}")
    private String relayHost;
    
    @Value("${rabbitmq.port}")
    private int rabbitmqPort;
    
    @Value("${rabbitmq.login}")
    private String rabbitmqLogin;
    
    @Value("${rabbitmq.password}")
    private String rabbitmqPassword;
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableStompBrokerRelay("/topic/").setRelayHost(relayHost).setRelayPort(rabbitmqPort).
                setClientLogin(rabbitmqLogin).
                setClientPasscode(rabbitmqPassword).
                setSystemLogin(rabbitmqLogin).
                setSystemPasscode(rabbitmqPassword).
                setVirtualHost(rabbitmqLogin);
        config.setApplicationDestinationPrefixes("/app"); 
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/stompendpoint").setAllowedOrigins("*").withSockJS();
    }
        
}
