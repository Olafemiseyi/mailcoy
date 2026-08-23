export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          actor_user_id: string | null
          at: string
          id: string
          meta: Json | null
          organization_id: string
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          at?: string
          id?: string
          meta?: Json | null
          organization_id: string
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          at?: string
          id?: string
          meta?: Json | null
          organization_id?: string
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      aliases: {
        Row: {
          address: string
          created_at: string
          employee_id: string
          id: string
          is_primary: boolean
          organization_id: string
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
          employee_id: string
          id?: string
          is_primary?: boolean
          organization_id: string
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
          employee_id?: string
          id?: string
          is_primary?: boolean
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "aliases_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aliases_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          created_at: string
          created_by: string | null
          hash: string
          id: string
          last_used_at: string | null
          name: string
          organization_id: string
          prefix: string
          revoked_at: string | null
          scopes: string[]
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          hash: string
          id?: string
          last_used_at?: string | null
          name: string
          organization_id: string
          prefix: string
          revoked_at?: string | null
          scopes?: string[]
        }
        Update: {
          created_at?: string
          created_by?: string | null
          hash?: string
          id?: string
          last_used_at?: string | null
          name?: string
          organization_id?: string
          prefix?: string
          revoked_at?: string | null
          scopes?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      app_user_connections: {
        Row: {
          connection_key_ciphertext: string
          connector_id: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          connection_key_ciphertext: string
          connector_id: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          connection_key_ciphertext?: string
          connector_id?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_user_id: string | null
          at: string
          id: string
          ip: string | null
          meta: Json | null
          organization_id: string | null
          ua: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          at?: string
          id?: string
          ip?: string | null
          meta?: Json | null
          organization_id?: string | null
          ua?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          at?: string
          id?: string
          ip?: string | null
          meta?: Json | null
          organization_id?: string | null
          ua?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          organization_id: string | null
          payload: Json
          provider: string
          received_at: string
          reference: string | null
          status: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          organization_id?: string | null
          payload: Json
          provider: string
          received_at?: string
          reference?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          organization_id?: string | null
          payload?: Json
          provider?: string
          received_at?: string
          reference?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
        }
        Relationships: []
      }
      delivery_status: {
        Row: {
          at: string
          email_log_id: string | null
          event: string
          id: string
          meta: Json | null
          organization_id: string
        }
        Insert: {
          at?: string
          email_log_id?: string | null
          event: string
          id?: string
          meta?: Json | null
          organization_id: string
        }
        Update: {
          at?: string
          email_log_id?: string | null
          event?: string
          id?: string
          meta?: Json | null
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_status_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      domains: {
        Row: {
          created_at: string
          dkim_private_key_enc: string | null
          dkim_public_key: string | null
          dkim_selector: string | null
          dkim_status: Database["public"]["Enums"]["verification_state"]
          dkim_value: string | null
          dmarc_status: Database["public"]["Enums"]["verification_state"]
          domain_name: string
          errors: Json | null
          id: string
          last_checked_at: string | null
          mx_status: Database["public"]["Enums"]["verification_state"]
          organization_id: string
          spf_status: Database["public"]["Enums"]["verification_state"]
          spf_value: string | null
          txt_record_key: string | null
          txt_record_value: string | null
          txt_status: string | null
          updated_at: string
          verification_errors: string | null
          verification_method: string | null
          verification_status: Database["public"]["Enums"]["verification_state"]
          verification_token: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          dkim_private_key_enc?: string | null
          dkim_public_key?: string | null
          dkim_selector?: string | null
          dkim_status?: Database["public"]["Enums"]["verification_state"]
          dkim_value?: string | null
          dmarc_status?: Database["public"]["Enums"]["verification_state"]
          domain_name: string
          errors?: Json | null
          id?: string
          last_checked_at?: string | null
          mx_status?: Database["public"]["Enums"]["verification_state"]
          organization_id: string
          spf_status?: Database["public"]["Enums"]["verification_state"]
          spf_value?: string | null
          txt_record_key?: string | null
          txt_record_value?: string | null
          txt_status?: string | null
          updated_at?: string
          verification_errors?: string | null
          verification_method?: string | null
          verification_status?: Database["public"]["Enums"]["verification_state"]
          verification_token?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          dkim_private_key_enc?: string | null
          dkim_public_key?: string | null
          dkim_selector?: string | null
          dkim_status?: Database["public"]["Enums"]["verification_state"]
          dkim_value?: string | null
          dmarc_status?: Database["public"]["Enums"]["verification_state"]
          domain_name?: string
          errors?: Json | null
          id?: string
          last_checked_at?: string | null
          mx_status?: Database["public"]["Enums"]["verification_state"]
          organization_id?: string
          spf_status?: Database["public"]["Enums"]["verification_state"]
          spf_value?: string | null
          txt_record_key?: string | null
          txt_record_value?: string | null
          txt_status?: string | null
          updated_at?: string
          verification_errors?: string | null
          verification_method?: string | null
          verification_status?: Database["public"]["Enums"]["verification_state"]
          verification_token?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "domains_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          direction: Database["public"]["Enums"]["email_direction"]
          id: string
          organization_id: string
          receiver: string
          sender: string
          snippet: string | null
          status: Database["public"]["Enums"]["email_status"]
          subject: string | null
          timestamp: string
        }
        Insert: {
          direction: Database["public"]["Enums"]["email_direction"]
          id?: string
          organization_id: string
          receiver: string
          sender: string
          snippet?: string | null
          status: Database["public"]["Enums"]["email_status"]
          subject?: string | null
          timestamp?: string
        }
        Update: {
          direction?: Database["public"]["Enums"]["email_direction"]
          id?: string
          organization_id?: string
          receiver?: string
          sender?: string
          snippet?: string | null
          status?: Database["public"]["Enums"]["email_status"]
          subject?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          id: string
          organization_id: string
          name: string
          subject: string
          html_body: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          subject: string
          html_body: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          subject?: string
          html_body?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      email_signatures: {
        Row: {
          created_at: string
          html: string
          id: string
          is_default: boolean
          name: string
          organization_id: string
          scope: string
          scope_ref: string | null
          updated_at: string
          variables: Json
        }
        Insert: {
          created_at?: string
          html: string
          id?: string
          is_default?: boolean
          name: string
          organization_id: string
          scope?: string
          scope_ref?: string | null
          updated_at?: string
          variables?: Json
        }
        Update: {
          created_at?: string
          html?: string
          id?: string
          is_default?: boolean
          name?: string
          organization_id?: string
          scope?: string
          scope_ref?: string | null
          updated_at?: string
          variables?: Json
        }
        Relationships: [
          {
            foreignKeyName: "email_signatures_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          created_by: string | null
          employee_id: string
          expires_at: string
          id: string
          opened_at: string | null
          organization_id: string
          revoked_at: string | null
          sent_at: string | null
          sent_via: string | null
          token: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          created_by?: string | null
          employee_id: string
          expires_at?: string
          id?: string
          opened_at?: string | null
          organization_id: string
          revoked_at?: string | null
          sent_at?: string | null
          sent_via?: string | null
          token: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          created_by?: string | null
          employee_id?: string
          expires_at?: string
          id?: string
          opened_at?: string | null
          organization_id?: string
          revoked_at?: string | null
          sent_at?: string | null
          sent_via?: string | null
          token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_invitations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          added_at: string
          company_email: string
          connected_at: string | null
          deleted_at: string | null
          department: string | null
          full_name: string
          id: string
          invited_at: string | null
          job_title: string | null
          organization_id: string
          personal_email: string
          professional_email: string | null
          status: Database["public"]["Enums"]["employee_state"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          added_at?: string
          company_email: string
          connected_at?: string | null
          deleted_at?: string | null
          department?: string | null
          full_name: string
          id?: string
          invited_at?: string | null
          job_title?: string | null
          organization_id: string
          personal_email: string
          professional_email?: string | null
          status?: Database["public"]["Enums"]["employee_state"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          added_at?: string
          company_email?: string
          connected_at?: string | null
          deleted_at?: string | null
          department?: string | null
          full_name?: string
          id?: string
          invited_at?: string | null
          job_title?: string | null
          organization_id?: string
          personal_email?: string
          professional_email?: string | null
          status?: Database["public"]["Enums"]["employee_state"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      gmail_connections: {
        Row: {
          connected_at: string
          created_at: string
          employee_id: string
          google_email: string
          health_status: string
          id: string
          last_health_check_at: string | null
          organization_id: string
          revoked_at: string | null
          updated_at: string
        }
        Insert: {
          connected_at?: string
          created_at?: string
          employee_id: string
          google_email: string
          health_status?: string
          id?: string
          last_health_check_at?: string | null
          organization_id: string
          revoked_at?: string | null
          updated_at?: string
        }
        Update: {
          connected_at?: string
          created_at?: string
          employee_id?: string
          google_email?: string
          health_status?: string
          id?: string
          last_health_check_at?: string | null
          organization_id?: string
          revoked_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gmail_connections_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: true
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gmail_connections_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      incoming_messages: {
        Row: {
          employee_id: string | null
          from_addr: string
          id: string
          message_id: string | null
          organization_id: string
          received_at: string
          size_bytes: number | null
          spam_score: number | null
          to_addr: string
        }
        Insert: {
          employee_id?: string | null
          from_addr: string
          id?: string
          message_id?: string | null
          organization_id: string
          received_at?: string
          size_bytes?: number | null
          spam_score?: number | null
          to_addr: string
        }
        Update: {
          employee_id?: string | null
          from_addr?: string
          id?: string
          message_id?: string | null
          organization_id?: string
          received_at?: string
          size_bytes?: number | null
          spam_score?: number | null
          to_addr?: string
        }
        Relationships: [
          {
            foreignKeyName: "incoming_messages_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incoming_messages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          organization_id: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          country: string | null
          created_at: string
          created_by: string | null
          currency: string | null
          deleted_at: string | null
          id: string
          industry: string | null
          logo_url: string | null
          name: string
          onboarding_completed_at: string | null
          onboarding_step: number | null
          primary_domain: string | null
          slug: string | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          deleted_at?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name: string
          onboarding_completed_at?: string | null
          onboarding_step?: number | null
          primary_domain?: string | null
          slug?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          country?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          deleted_at?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          name?: string
          onboarding_completed_at?: string | null
          onboarding_step?: number | null
          primary_domain?: string | null
          slug?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      outgoing_messages: {
        Row: {
          employee_id: string | null
          from_addr: string
          id: string
          message_id: string | null
          organization_id: string
          sent_at: string
          size_bytes: number | null
          to_addr: string
        }
        Insert: {
          employee_id?: string | null
          from_addr: string
          id?: string
          message_id?: string | null
          organization_id: string
          sent_at?: string
          size_bytes?: number | null
          to_addr: string
        }
        Update: {
          employee_id?: string | null
          from_addr?: string
          id?: string
          message_id?: string | null
          organization_id?: string
          sent_at?: string
          size_bytes?: number | null
          to_addr?: string
        }
        Relationships: [
          {
            foreignKeyName: "outgoing_messages_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outgoing_messages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          active: boolean
          code: string
          created_at: string
          domains_limit: number | null
          features: Json
          id: string
          name: string
          price_ngn: number
          price_usd: number
          seats_limit: number | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          domains_limit?: number | null
          features?: Json
          id?: string
          name: string
          price_ngn?: number
          price_usd?: number
          seats_limit?: number | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          domains_limit?: number | null
          features?: Json
          id?: string
          name?: string
          price_ngn?: number
          price_usd?: number
          seats_limit?: number | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      platform_status_checks: {
        Row: {
          checked_at: string
          component: string
          detail: string | null
          id: string
          latency_ms: number | null
          status: string
        }
        Insert: {
          checked_at?: string
          component: string
          detail?: string | null
          id?: string
          latency_ms?: number | null
          status: string
        }
        Update: {
          checked_at?: string
          component?: string
          detail?: string | null
          id?: string
          latency_ms?: number | null
          status?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      routing_rules: {
        Row: {
          action: string
          created_at: string
          id: string
          match_pattern: string
          organization_id: string
          priority: number
          target: string | null
          updated_at: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          match_pattern: string
          organization_id: string
          priority?: number
          target?: string | null
          updated_at?: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          match_pattern?: string
          organization_id?: string
          priority?: number
          target?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "routing_rules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      sending_logs: {
        Row: {
          created_at: string
          employee_id: string | null
          error: string | null
          from_address: string | null
          id: string
          latency_ms: number | null
          message_id: string | null
          meta: Json
          organization_id: string
          provider: string
          smtp_response: string | null
          status: string
          subject: string | null
          to_address: string | null
        }
        Insert: {
          created_at?: string
          employee_id?: string | null
          error?: string | null
          from_address?: string | null
          id?: string
          latency_ms?: number | null
          message_id?: string | null
          meta?: Json
          organization_id: string
          provider: string
          smtp_response?: string | null
          status: string
          subject?: string | null
          to_address?: string | null
        }
        Update: {
          created_at?: string
          employee_id?: string | null
          error?: string | null
          from_address?: string | null
          id?: string
          latency_ms?: number | null
          message_id?: string | null
          meta?: Json
          organization_id?: string
          provider?: string
          smtp_response?: string | null
          status?: string
          subject?: string | null
          to_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sending_logs_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sending_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ses_bounce_events: {
        Row: {
          bounce_subtype: string | null
          bounce_type: string | null
          created_at: string
          id: string
          organization_id: string
          raw: Json
          recipient: string | null
          sending_log_id: string | null
        }
        Insert: {
          bounce_subtype?: string | null
          bounce_type?: string | null
          created_at?: string
          id?: string
          organization_id: string
          raw?: Json
          recipient?: string | null
          sending_log_id?: string | null
        }
        Update: {
          bounce_subtype?: string | null
          bounce_type?: string | null
          created_at?: string
          id?: string
          organization_id?: string
          raw?: Json
          recipient?: string | null
          sending_log_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ses_bounce_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ses_bounce_events_sending_log_id_fkey"
            columns: ["sending_log_id"]
            isOneToOne: false
            referencedRelation: "sending_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      ses_complaint_events: {
        Row: {
          complaint_type: string | null
          created_at: string
          id: string
          organization_id: string
          raw: Json
          recipient: string | null
          sending_log_id: string | null
        }
        Insert: {
          complaint_type?: string | null
          created_at?: string
          id?: string
          organization_id: string
          raw?: Json
          recipient?: string | null
          sending_log_id?: string | null
        }
        Update: {
          complaint_type?: string | null
          created_at?: string
          id?: string
          organization_id?: string
          raw?: Json
          recipient?: string | null
          sending_log_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ses_complaint_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ses_complaint_events_sending_log_id_fkey"
            columns: ["sending_log_id"]
            isOneToOne: false
            referencedRelation: "sending_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      ses_credentials: {
        Row: {
          access_key_id_ciphertext: string
          configuration_set: string | null
          created_at: string
          daily_quota: number | null
          id: string
          organization_id: string
          region: string
          reputation_score: number | null
          secret_access_key_ciphertext: string
          send_rate: number | null
          updated_at: string
        }
        Insert: {
          access_key_id_ciphertext: string
          configuration_set?: string | null
          created_at?: string
          daily_quota?: number | null
          id?: string
          organization_id: string
          region: string
          reputation_score?: number | null
          secret_access_key_ciphertext: string
          send_rate?: number | null
          updated_at?: string
        }
        Update: {
          access_key_id_ciphertext?: string
          configuration_set?: string | null
          created_at?: string
          daily_quota?: number | null
          id?: string
          organization_id?: string
          region?: string
          reputation_score?: number | null
          secret_access_key_ciphertext?: string
          send_rate?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ses_credentials_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ses_domains: {
        Row: {
          created_at: string
          dkim_tokens: string[] | null
          domain_id: string
          id: string
          identity_status: string
          organization_id: string
          region: string
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          dkim_tokens?: string[] | null
          domain_id: string
          id?: string
          identity_status?: string
          organization_id: string
          region?: string
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          dkim_tokens?: string[] | null
          domain_id?: string
          id?: string
          identity_status?: string
          organization_id?: string
          region?: string
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ses_domains_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ses_domains_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          catchall_forward_to: string | null
          catchall_mode: string
          company_signature: string | null
          dkim_enabled: boolean
          notify_digest: boolean
          notify_email: boolean
          organization_id: string
          routing_active: boolean
          security_mfa: boolean
          updated_at: string
        }
        Insert: {
          catchall_forward_to?: string | null
          catchall_mode?: string
          company_signature?: string | null
          dkim_enabled?: boolean
          notify_digest?: boolean
          notify_email?: boolean
          organization_id: string
          routing_active?: boolean
          security_mfa?: boolean
          updated_at?: string
        }
        Update: {
          catchall_forward_to?: string | null
          catchall_mode?: string
          company_signature?: string | null
          dkim_enabled?: boolean
          notify_digest?: boolean
          notify_email?: boolean
          organization_id?: string
          routing_active?: boolean
          security_mfa?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount_kobo: number | null
          api_limit_monthly: number
          created_at: string
          current_period_end: string | null
          max_aliases: number
          max_domains: number
          max_employees: number
          organization_id: string
          plan: string
          plan_code: string | null
          provider: string | null
          provider_reference: string | null
          renewal_date: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          storage_gb: number
          trial_end: string | null
          updated_at: string
        }
        Insert: {
          amount_kobo?: number | null
          api_limit_monthly?: number
          created_at?: string
          current_period_end?: string | null
          max_aliases?: number
          max_domains?: number
          max_employees?: number
          organization_id: string
          plan?: string
          plan_code?: string | null
          provider?: string | null
          provider_reference?: string | null
          renewal_date?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          storage_gb?: number
          trial_end?: string | null
          updated_at?: string
        }
        Update: {
          amount_kobo?: number | null
          api_limit_monthly?: number
          created_at?: string
          current_period_end?: string | null
          max_aliases?: number
          max_domains?: number
          max_employees?: number
          organization_id?: string
          plan?: string
          plan_code?: string | null
          provider?: string | null
          provider_reference?: string | null
          renewal_date?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          storage_gb?: number
          trial_end?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_deliveries: {
        Row: {
          attempts: number
          created_at: string
          event: string
          id: string
          next_attempt_at: string | null
          organization_id: string
          payload: Json
          response_body: string | null
          response_status: number | null
          status: string
          updated_at: string
          webhook_id: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          event: string
          id?: string
          next_attempt_at?: string | null
          organization_id: string
          payload: Json
          response_body?: string | null
          response_status?: number | null
          status?: string
          updated_at?: string
          webhook_id: string
        }
        Update: {
          attempts?: number
          created_at?: string
          event?: string
          id?: string
          next_attempt_at?: string | null
          organization_id?: string
          payload?: Json
          response_body?: string | null
          response_status?: number | null
          status?: string
          updated_at?: string
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_deliveries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhook_deliveries_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "webhooks"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks: {
        Row: {
          active: boolean
          created_at: string
          events: string[]
          id: string
          organization_id: string
          secret_hash: string
          updated_at: string
          url: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          events?: string[]
          id?: string
          organization_id: string
          secret_hash: string
          updated_at?: string
          url: string
        }
        Update: {
          active?: boolean
          created_at?: string
          events?: string[]
          id?: string
          organization_id?: string
          secret_hash?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_org_role: {
        Args: { _org: string; _role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_org_member: { Args: { _org: string }; Returns: boolean }
      is_platform_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "owner" | "admin" | "member" | "platform_admin"
      email_direction: "incoming" | "outgoing"
      email_status: "routed" | "delivered" | "sent" | "failed" | "bounced"
      employee_state:
        | "active"
        | "pending_auth"
        | "invited"
        | "pending"
        | "opened"
        | "connected"
        | "suspended"
        | "inactive"
        | "deleted"
      subscription_status:
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "inactive"
      verification_state: "pending" | "verified" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["owner", "admin", "member", "platform_admin"],
      email_direction: ["incoming", "outgoing"],
      email_status: ["routed", "delivered", "sent", "failed", "bounced"],
      employee_state: [
        "active",
        "pending_auth",
        "invited",
        "pending",
        "opened",
        "connected",
        "suspended",
        "inactive",
        "deleted",
      ],
      subscription_status: [
        "trialing",
        "active",
        "past_due",
        "canceled",
        "inactive",
      ],
      verification_state: ["pending", "verified", "failed"],
    },
  },
} as const
