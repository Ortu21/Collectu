﻿// <auto-generated />
using System;
using CardCollectionAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CardCollectionAPI.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20250316122838_cambioTipoNumberInstringa")]
    partial class cambioTipoNumberInstringa
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("CardCollectionAPI.Models.PokemonAttack", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("ConvertedEnergyCost")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Cost")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Damage")
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PokemonCardId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("PokemonCardId");

                    b.ToTable("PokemonAttacks");
                });

            modelBuilder.Entity("CardCollectionAPI.Models.PokemonCard", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<string>("EvolvesFrom")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Hp")
                        .HasColumnType("text");

                    b.Property<string>("ImageUrl")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Number")
                        .HasColumnType("text");

                    b.Property<string>("Rarity")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SetId")
                        .HasColumnType("text");

                    b.Property<string>("Supertype")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("SetId");

                    b.ToTable("PokemonCards");
                });

            modelBuilder.Entity("CardCollectionAPI.Models.PokemonCardMarketPriceDetails", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<decimal?>("AverageSellPrice")
                        .HasColumnType("numeric");

                    b.Property<decimal?>("Avg1")
                        .HasColumnType("numeric");

                    b.Property<decimal?>("Avg30")
                        .HasColumnType("numeric");

                    b.Property<decimal?>("Avg7")
                        .HasColumnType("numeric");

                    b.Property<decimal?>("GermanProLow")
                        .HasColumnType("numeric");

                    b.Property<decimal?>("LowPrice")
                        .HasColumnType("numeric");

                    b.Property<decimal?>("LowPriceExPlus")
                        .HasColumnType("numeric");

                    b.Property<int>("PokemonCardMarketPricesId")
                        .HasColumnType("integer");

                    b.Property<decimal?>("ReverseHoloAvg1")
                        .HasColumnType("numeric");

                    b.Property<decimal?>("ReverseHoloAvg30")
                        .HasColumnType("numeric");

                    b.Property<decimal?>("ReverseHoloAvg7")
                        .HasColumnType("numeric");

                    b.Property<decimal?>("ReverseHoloLow")
                        .HasColumnType("numeric");

                    b.Property<decimal?>("ReverseHoloSell")
                        .HasColumnType("numeric");

                    b.Property<decimal?>("ReverseHoloTrend")
                        .HasColumnType("numeric");

                    b.Property<decimal?>("SuggestedPrice")
                        .HasColumnType("numeric");

                    b.Property<decimal?>("TrendPrice")
                        .HasColumnType("numeric");

                    b.HasKey("Id");

                    b.HasIndex("PokemonCardMarketPricesId");

                    b.ToTable("PokemonCardMarketPriceDetails");
                });

            modelBuilder.Entity("CardCollectionAPI.Models.PokemonCardMarketPrices", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("PokemonCardId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateOnly>("UpdatedAt")
                        .HasColumnType("date");

                    b.Property<string>("Url")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("PokemonCardId")
                        .IsUnique();

                    b.ToTable("PokemonCardMarketPrices");
                });

            modelBuilder.Entity("CardCollectionAPI.Models.PokemonResistance", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("PokemonCardId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Value")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("PokemonCardId");

                    b.ToTable("PokemonResistances");
                });

            modelBuilder.Entity("CardCollectionAPI.Models.PokemonSet", b =>
                {
                    b.Property<string>("SetId")
                        .HasColumnType("text");

                    b.Property<string>("LogoUrl")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateOnly>("ReleaseDate")
                        .HasColumnType("date");

                    b.Property<string>("Series")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SetName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("SetId");

                    b.ToTable("PokemonSets");
                });

            modelBuilder.Entity("CardCollectionAPI.Models.PokemonTcgPlayerPriceDetails", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<decimal?>("DirectLow")
                        .HasColumnType("numeric");

                    b.Property<string>("FoilType")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<decimal?>("High")
                        .HasColumnType("numeric");

                    b.Property<decimal?>("Low")
                        .HasColumnType("numeric");

                    b.Property<decimal?>("Market")
                        .HasColumnType("numeric");

                    b.Property<decimal?>("Mid")
                        .HasColumnType("numeric");

                    b.Property<int>("PokemonTcgPlayerPricesId")
                        .HasColumnType("integer");

                    b.HasKey("Id");

                    b.HasIndex("PokemonTcgPlayerPricesId");

                    b.ToTable("PokemonCardTcgPriceDetails");
                });

            modelBuilder.Entity("CardCollectionAPI.Models.PokemonTcgPlayerPrices", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("PokemonCardId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateOnly>("UpdatedAt")
                        .HasColumnType("date");

                    b.Property<string>("Url")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("PokemonCardId")
                        .IsUnique();

                    b.ToTable("PokemonCardTcgPrices");
                });

            modelBuilder.Entity("CardCollectionAPI.Models.PokemonWeakness", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("PokemonCardId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Value")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("PokemonCardId");

                    b.ToTable("PokemonWeaknesses");
                });

            modelBuilder.Entity("CardCollectionAPI.Models.PokemonAttack", b =>
                {
                    b.HasOne("CardCollectionAPI.Models.PokemonCard", "PokemonCard")
                        .WithMany("Attacks")
                        .HasForeignKey("PokemonCardId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("PokemonCard");
                });

            modelBuilder.Entity("CardCollectionAPI.Models.PokemonCard", b =>
                {
                    b.HasOne("CardCollectionAPI.Models.PokemonSet", "Set")
                        .WithMany("Cards")
                        .HasForeignKey("SetId");

                    b.Navigation("Set");
                });

            modelBuilder.Entity("CardCollectionAPI.Models.PokemonCardMarketPriceDetails", b =>
                {
                    b.HasOne("CardCollectionAPI.Models.PokemonCardMarketPrices", "PokemonCardMarketPrices")
                        .WithMany("PriceDetails")
                        .HasForeignKey("PokemonCardMarketPricesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("PokemonCardMarketPrices");
                });

            modelBuilder.Entity("CardCollectionAPI.Models.PokemonCardMarketPrices", b =>
                {
                    b.HasOne("CardCollectionAPI.Models.PokemonCard", "PokemonCard")
                        .WithOne("CardMarketPrices")
                        .HasForeignKey("CardCollectionAPI.Models.PokemonCardMarketPrices", "PokemonCardId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("PokemonCard");
                });

            modelBuilder.Entity("CardCollectionAPI.Models.PokemonResistance", b =>
                {
                    b.HasOne("CardCollectionAPI.Models.PokemonCard", "PokemonCard")
                        .WithMany("Resistances")
                        .HasForeignKey("PokemonCardId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("PokemonCard");
                });

            modelBuilder.Entity("CardCollectionAPI.Models.PokemonTcgPlayerPriceDetails", b =>
                {
                    b.HasOne("CardCollectionAPI.Models.PokemonTcgPlayerPrices", "PokemonTcgPlayerPrices")
                        .WithMany("PriceDetails")
                        .HasForeignKey("PokemonTcgPlayerPricesId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("PokemonTcgPlayerPrices");
                });

            modelBuilder.Entity("CardCollectionAPI.Models.PokemonTcgPlayerPrices", b =>
                {
                    b.HasOne("CardCollectionAPI.Models.PokemonCard", "PokemonCard")
                        .WithOne("TcgPlayerPrices")
                        .HasForeignKey("CardCollectionAPI.Models.PokemonTcgPlayerPrices", "PokemonCardId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("PokemonCard");
                });

            modelBuilder.Entity("CardCollectionAPI.Models.PokemonWeakness", b =>
                {
                    b.HasOne("CardCollectionAPI.Models.PokemonCard", "PokemonCard")
                        .WithMany("Weaknesses")
                        .HasForeignKey("PokemonCardId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("PokemonCard");
                });

            modelBuilder.Entity("CardCollectionAPI.Models.PokemonCard", b =>
                {
                    b.Navigation("Attacks");

                    b.Navigation("CardMarketPrices");

                    b.Navigation("Resistances");

                    b.Navigation("TcgPlayerPrices");

                    b.Navigation("Weaknesses");
                });

            modelBuilder.Entity("CardCollectionAPI.Models.PokemonCardMarketPrices", b =>
                {
                    b.Navigation("PriceDetails");
                });

            modelBuilder.Entity("CardCollectionAPI.Models.PokemonSet", b =>
                {
                    b.Navigation("Cards");
                });

            modelBuilder.Entity("CardCollectionAPI.Models.PokemonTcgPlayerPrices", b =>
                {
                    b.Navigation("PriceDetails");
                });
#pragma warning restore 612, 618
        }
    }
}
